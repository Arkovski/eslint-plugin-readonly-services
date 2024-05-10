/**
 * @fileoverview This ESLint plugin ensures that services injected into TypeScript classes are declared as readonly. It helps maintain immutability by preventing reassignment of injected services, fostering better coding practices and enhancing stability in applications using dependency injection.
 * @author Arkovski
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");
