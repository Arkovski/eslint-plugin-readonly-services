# eslint-plugin-readonly-services

This ESLint plugin ensures that services injected into TypeScript classes are declared as readonly. It helps maintain immutability by preventing reassignment of injected services, fostering better coding practices and enhancing stability in applications using dependency injection.

**Purpose of the Plugin**: Ensures services are declared as readonly.  
**Target**: TypeScript classes where services are injected.  
**Benefit**: Maintains immutability and prevents reassignments, which leads to better coding practices and enhanced stability.  
**Context**: Useful in applications that use dependency injection, which is a common pattern in frameworks like Angular.  

## This plugin is published in the npmjs.org
```sh
npm link eslint-plugin-readonly-services
npx eslint "src/scripts/*.{js,ts}"
$env:ESLINT_PLUGIN_LOGGING="off"; npx eslint "src/scripts/*.{js,ts}"    # if you want to disable logging. Enable by running this command with "on"
```

# Or if you want to customize this plugin, test, etc., follow the code below:
## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Ensure you have installed the necessary dependencies to support TypeScript in ESLint configurations:
```sh
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin
```


Next, install `eslint-plugin-readonly-services`:

```sh
npm install eslint-plugin-readonly-services --save-dev
```

## Usage

Add `readonly-services` **(without `eslint-plugin-`)** to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "readonly-services"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "readonly-services/rule-name": 2
    }
}
```

Example ```.eslintrc.json``` code:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "sourceType": "module",
    "ecmaVersion": 2022,
    "createDefaultProgram": true
  },
  "plugins": [
    "eslint-plugin-readonly-services"
  ],
  "rules": {
    "eslint-plugin-readonly-services/readonly-injected-services": "error"
  }
}

```

Example ```.eslintrc.ts``` code:

```ts
module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
        ecmaVersion: 2022,
        createDefaultProgram: true
    },
    plugins: [
        "eslint-plugin-readonly-services"
    ],
    rules: {
        "eslint-plugin-readonly-services/readonly-injected-services": "error"
    },
};
```

## Run
In your angular root directory:
```sh
npx eslint "src/scripts/*.{js,ts}"          # displays issues detected by ESLint. scr/scripts any other sub-directory with your JS/TS files
npx eslint "src/scripts/*.{js,ts}" --fix    # automatically changes the code

# for PowerShell
$env:ESLINT_PLUGIN_LOGGING="off"; npx eslint "src/scripts/*.{js,ts}"  # to turn off logging
$env:ESLINT_PLUGIN_LOGGING="on"; npx eslint "src/scripts/*.{js,ts}"   # to bring back logging

# for CMD
set ESLINT_PLUGIN_LOGGING=off && npx eslint "src/scripts/*.{js,ts}"
set ESLINT_PLUGIN_LOGGING=on && npx eslint "src/scripts/*.{js,ts}"
````

## Test code

Angular project was created by:
```sh
npm install -g @angular/cli
```

In your terminal (CMD or powershell):


```sh
cd <path-to>\readonly_services_plugin
npm link eslint-plugin-readonly-service

npm list -g --depth=0
```

```sh
cd <path-to>\readonly_services_plugin\tests\angular\readonly-inject-test
npx eslint "src/scripts/*.{js,ts}"
```

Everything is fine if your output looks like:
```sh
C:\Sources\ESLintPlugins\readonly_services_plugin\tests\angular\readonly-inject-test\src\scripts\test.component.ts
1:1   error  Import and export declarations are not supported yet  node/no-unsupported-features/es-syntax
1:27  error  "@angular/core" is not found                          node/no-missing-import
2:1   error  Import and export declarations are not supported yet  node/no-unsupported-features/es-syntax
2:29  error  "./test.service" is not found                         node/no-missing-import
9:1   error  Import and export declarations are not supported yet  node/no-unsupported-features/es-syntax
11:5   error  Parameter property can be made readonly               readonly-services/readonly-injected-services
11:13  error  'testService' is defined but never used               no-unused-vars
12:5   error  Parameter property can be made readonly               readonly-services/readonly-injected-services

C:\Sources\ESLintPlugins\readonly_services_plugin\tests\angular\readonly-inject-test\src\scripts\test.service.ts
1:1   error  Import and export declarations are not supported yet  node/no-unsupported-features/es-syntax
1:28  error  "@angular/core" is not found                          node/no-missing-import
4:1   error  Import and export declarations are not supported yet  node/no-unsupported-features/es-syntax
6:22  error  'readonlyService' is defined but never used           no-unused-vars
7:5   error  Parameter property can be made readonly               readonly-services/readonly-injected-services
7:13  error  'writableService' is defined but never used           no-unused-vars
8:13  error  'reassignableService' is defined but never used       no-unused-vars
```

To address the ```error  Parameter property can be made readonly               readonly-services/readonly-injected-services``` use `--fix` flag

# Build your custom plugins:
I used Yeoman file structure generator.

```sh
npm install -g yo
npm install -g generator-eslint

mkdir eslint-plugin-example
cd eslint-plugin-example

yo eslint:plugin  // or yo eslint:rule

npm link eslint-plugin-example // Locally installing your own stuff, so that you can work on it and test iteratively without having to continually rebuild.
```

