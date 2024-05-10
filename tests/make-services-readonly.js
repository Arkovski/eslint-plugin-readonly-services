const { RuleTester } = require("eslint");
const readonlyRule = require("../lib/rules/readonly-injected-services");

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            decorators: true,
            experimentalObjectRestSpread: true
        }
    },
    // eslint-disable-next-line node/no-unpublished-require
    parser: require.resolve('@babel/eslint-parser')
});

ruleTester.run(
    "eslint-plugin-readonly-services",
    readonlyRule,
    {
        valid: [
            {
                code: `
                    import { Injectable } from "@angular/core";

                    @Injectable()
                    class TestService {
                        constructor(
                            private readonly readOnlyService: any,
                            private writableService: any
                        ) {}
                    }
                `,
                options: [{ enforceReadonly: true }]
            }
        ],
        invalid: [
            {
                code: `
                    import { Injectable } from "@angular/core";

                    @Injectable()
                    class TestService {
                        constructor(
                            private readOnlyService: any, // should be readonly
                            private writableService: any
                        ) {}
                    }
                `,
                output: `
                    import { Injectable } from "@angular/core";

                    @Injectable()
                    class TestService {
                        constructor(
                            private readOnlyService: any,
                            private writableService: any
                        ) {}
                    }
                `,
                errors: [{
                    messageId: "addReadonly",
                    type: "Identifier"
                }]
            }
        ]
    }
);


console.log("All tests passed!");
