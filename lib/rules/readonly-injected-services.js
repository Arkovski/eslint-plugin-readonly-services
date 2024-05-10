module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "enforce readonly on injected services",
            category: "Best Practices",
            recommended: true
        },
        fixable: "code",
        schema: [],
        messages: {
            addReadonly: "Injected service properties should be readonly."
        }
    },
    create(context) {
        return {
            ClassDeclaration(node) {
                const shouldLog = process.env.ESLINT_PLUGIN_LOGGING !== 'off';
                const injectedPrivateServices = new Map();

                // Step 1: Collect potential readonly properties in constructor
                node.body.body.forEach(member => {
                    if (member.type === 'MethodDefinition' && member.kind === 'constructor') {
                        member.value.params.forEach(param => {
                            if (param.type === 'TSParameterProperty' && param.accessibility === 'private' && !param.readonly) {
                                if (shouldLog) {
                                    console.log(`[Constructor Analysis] Identified non-readonly private parameter: ${param.parameter.name}`, param);
                                }
                                
                                injectedPrivateServices.set(param.parameter.name, param);
                            }
                        });
                    }
                });

                if (shouldLog) {
                    console.log('[Info] List of identified class properties that may be reassigned:', Array.from(injectedPrivateServices.keys()));
                }

                // Step 2: Check if services are reassigned
                node.body.body.forEach(method => {
                    if (method.type === 'MethodDefinition') {
                        if (shouldLog) {
                            console.log(`[Method Analysis] Examining method: ${method.key.name}`, method.value);
                        }
                        
                        const scope = context.getSourceCode().scopeManager.acquire(method.value);
                        
                        if (shouldLog) {
                            console.log(`[Scope Analysis] Scope obtained for method: ${method.key.name}`, scope);
                        }

                        if (scope) {
                            if (shouldLog) {
                                console.log(`[Scope Validation] Valid scope for method: ${method.key.name}`, method);
                            }

                            // Loop through all references in the scope.
                            method.value.body.body.forEach(statement => {
                                // Checking for ExpressionStatement that involve assignment
                                if (statement.type === 'ExpressionStatement' &&
                                    statement.expression.type === 'AssignmentExpression' &&
                                    statement.expression.left.type === 'MemberExpression' &&
                                    statement.expression.left.object.type === 'ThisExpression' &&
                                    statement.expression.left.property.name.toLowerCase().includes('service')) {

                                    let serviceName = statement.expression.left.property.name;
                                    
                                    if (shouldLog) {
                                        console.log(`[Reassignment Detection] Assignment to service '${serviceName}' found in method: ${method.key.name}`);
                                    }
                                    
                                    injectedPrivateServices.forEach((value, key) => {
                                        if (key === serviceName) {
                                            if (shouldLog) {
                                                console.log(`[Warning] Reassignment of protected service '${key}' detected. Removing from tracked services.`);
                                            }
                                            injectedPrivateServices.delete(key);
                                            
                                            if (shouldLog) {
                                                console.log(`[Modification] Service '${key}' has been modified and removed from tracking.`);
                                            }
                                            
                                        }
                                    });
                                }
                            });
                        } else {
                            if (shouldLog) {
                                console.error(`[Error] Failed to acquire scope for method: ${method.key.name}`, method);
                            }
                        }
                    }
                });

                // Step 3: Report properties that can be made readonly
                injectedPrivateServices.forEach((property, name) => {
                    if (shouldLog) {
                        console.log(`[Readonly Eligibility] Checking if property '${name}' can be made readonly`, property);
                    }
                    
                    if (property.type === 'ClassProperty') {
                        context.report({
                            node: property,
                            message: "Property can be made readonly",
                            fix(fixer) {
                                return fixer.insertTextBefore(property, 'readonly ');
                            }
                        });
                    } else if (property.type === 'TSParameterProperty') {
                        context.report({
                            node: property,
                            message: "Parameter property can be made readonly",
                            fix(fixer) {
                                return fixer.insertTextBefore(property.parameter, 'readonly ');
                            }
                        });
                    }
                });
            }
        };
    }
};
