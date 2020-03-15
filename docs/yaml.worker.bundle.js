/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.js":
/*!************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.js ***!
  \************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\nvar conf = {\r\n    comments: {\r\n        lineComment: '#'\r\n    },\r\n    brackets: [\r\n        ['{', '}'],\r\n        ['[', ']'],\r\n        ['(', ')']\r\n    ],\r\n    autoClosingPairs: [\r\n        { open: '{', close: '}' },\r\n        { open: '[', close: ']' },\r\n        { open: '(', close: ')' },\r\n        { open: '\"', close: '\"' },\r\n        { open: '\\'', close: '\\'' },\r\n    ],\r\n    surroundingPairs: [\r\n        { open: '{', close: '}' },\r\n        { open: '[', close: ']' },\r\n        { open: '(', close: ')' },\r\n        { open: '\"', close: '\"' },\r\n        { open: '\\'', close: '\\'' },\r\n    ],\r\n    folding: {\r\n        offSide: true\r\n    }\r\n};\r\nvar language = {\r\n    tokenPostfix: '.yaml',\r\n    brackets: [\r\n        { token: 'delimiter.bracket', open: '{', close: '}' },\r\n        { token: 'delimiter.square', open: '[', close: ']' }\r\n    ],\r\n    keywords: ['true', 'True', 'TRUE', 'false', 'False', 'FALSE', 'null', 'Null', 'Null', '~'],\r\n    numberInteger: /(?:0|[+-]?[0-9]+)/,\r\n    numberFloat: /(?:0|[+-]?[0-9]+)(?:\\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,\r\n    numberOctal: /0o[0-7]+/,\r\n    numberHex: /0x[0-9a-fA-F]+/,\r\n    numberInfinity: /[+-]?\\.(?:inf|Inf|INF)/,\r\n    numberNaN: /\\.(?:nan|Nan|NAN)/,\r\n    numberDate: /\\d{4}-\\d\\d-\\d\\d([Tt ]\\d\\d:\\d\\d:\\d\\d(\\.\\d+)?(( ?[+-]\\d\\d?(:\\d\\d)?)|Z)?)?/,\r\n    escapes: /\\\\(?:[btnfr\\\\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,\r\n    tokenizer: {\r\n        root: [\r\n            { include: '@whitespace' },\r\n            { include: '@comment' },\r\n            // Directive\r\n            [/%[^ ]+.*$/, 'meta.directive'],\r\n            // Document Markers\r\n            [/---/, 'operators.directivesEnd'],\r\n            [/\\.{3}/, 'operators.documentEnd'],\r\n            // Block Structure Indicators\r\n            [/[-?:](?= )/, 'operators'],\r\n            { include: '@anchor' },\r\n            { include: '@tagHandle' },\r\n            { include: '@flowCollections' },\r\n            { include: '@blockStyle' },\r\n            // Numbers\r\n            [/@numberInteger(?![ \\t]*\\S+)/, 'number'],\r\n            [/@numberFloat(?![ \\t]*\\S+)/, 'number.float'],\r\n            [/@numberOctal(?![ \\t]*\\S+)/, 'number.octal'],\r\n            [/@numberHex(?![ \\t]*\\S+)/, 'number.hex'],\r\n            [/@numberInfinity(?![ \\t]*\\S+)/, 'number.infinity'],\r\n            [/@numberNaN(?![ \\t]*\\S+)/, 'number.nan'],\r\n            [/@numberDate(?![ \\t]*\\S+)/, 'number.date'],\r\n            // Key:Value pair\r\n            [/(\".*?\"|'.*?'|.*?)([ \\t]*)(:)( |$)/, ['type', 'white', 'operators', 'white']],\r\n            { include: '@flowScalars' },\r\n            // String nodes\r\n            [/.+$/, {\r\n                    cases: {\r\n                        '@keywords': 'keyword',\r\n                        '@default': 'string'\r\n                    }\r\n                }]\r\n        ],\r\n        // Flow Collection: Flow Mapping\r\n        object: [\r\n            { include: '@whitespace' },\r\n            { include: '@comment' },\r\n            // Flow Mapping termination\r\n            [/\\}/, '@brackets', '@pop'],\r\n            // Flow Mapping delimiter\r\n            [/,/, 'delimiter.comma'],\r\n            // Flow Mapping Key:Value delimiter\r\n            [/:(?= )/, 'operators'],\r\n            // Flow Mapping Key:Value key\r\n            [/(?:\".*?\"|'.*?'|[^,\\{\\[]+?)(?=: )/, 'type'],\r\n            // Start Flow Style\r\n            { include: '@flowCollections' },\r\n            { include: '@flowScalars' },\r\n            // Scalar Data types\r\n            { include: '@tagHandle' },\r\n            { include: '@anchor' },\r\n            { include: '@flowNumber' },\r\n            // Other value (keyword or string)\r\n            [/[^\\},]+/, {\r\n                    cases: {\r\n                        '@keywords': 'keyword',\r\n                        '@default': 'string'\r\n                    }\r\n                }]\r\n        ],\r\n        // Flow Collection: Flow Sequence\r\n        array: [\r\n            { include: '@whitespace' },\r\n            { include: '@comment' },\r\n            // Flow Sequence termination\r\n            [/\\]/, '@brackets', '@pop'],\r\n            // Flow Sequence delimiter\r\n            [/,/, 'delimiter.comma'],\r\n            // Start Flow Style\r\n            { include: '@flowCollections' },\r\n            { include: '@flowScalars' },\r\n            // Scalar Data types\r\n            { include: '@tagHandle' },\r\n            { include: '@anchor' },\r\n            { include: '@flowNumber' },\r\n            // Other value (keyword or string)\r\n            [/[^\\],]+/, {\r\n                    cases: {\r\n                        '@keywords': 'keyword',\r\n                        '@default': 'string'\r\n                    }\r\n                }]\r\n        ],\r\n        // First line of a Block Style\r\n        multiString: [\r\n            [/^( +).+$/, 'string', '@multiStringContinued.$1']\r\n        ],\r\n        // Further lines of a Block Style\r\n        //   Workaround for indentation detection\r\n        multiStringContinued: [\r\n            [/^( *).+$/, {\r\n                    cases: {\r\n                        '$1==$S2': 'string',\r\n                        '@default': { token: '@rematch', next: '@popall' }\r\n                    }\r\n                }]\r\n        ],\r\n        whitespace: [\r\n            [/[ \\t\\r\\n]+/, 'white']\r\n        ],\r\n        // Only line comments\r\n        comment: [\r\n            [/#.*$/, 'comment']\r\n        ],\r\n        // Start Flow Collections\r\n        flowCollections: [\r\n            [/\\[/, '@brackets', '@array'],\r\n            [/\\{/, '@brackets', '@object']\r\n        ],\r\n        // Start Flow Scalars (quoted strings)\r\n        flowScalars: [\r\n            [/\"([^\"\\\\]|\\\\.)*$/, 'string.invalid'],\r\n            [/'([^'\\\\]|\\\\.)*$/, 'string.invalid'],\r\n            [/'[^']*'/, 'string'],\r\n            [/\"/, 'string', '@doubleQuotedString']\r\n        ],\r\n        doubleQuotedString: [\r\n            [/[^\\\\\"]+/, 'string'],\r\n            [/@escapes/, 'string.escape'],\r\n            [/\\\\./, 'string.escape.invalid'],\r\n            [/\"/, 'string', '@pop']\r\n        ],\r\n        // Start Block Scalar\r\n        blockStyle: [\r\n            [/[>|][0-9]*[+-]?$/, 'operators', '@multiString']\r\n        ],\r\n        // Numbers in Flow Collections (terminate with ,]})\r\n        flowNumber: [\r\n            [/@numberInteger(?=[ \\t]*[,\\]\\}])/, 'number'],\r\n            [/@numberFloat(?=[ \\t]*[,\\]\\}])/, 'number.float'],\r\n            [/@numberOctal(?=[ \\t]*[,\\]\\}])/, 'number.octal'],\r\n            [/@numberHex(?=[ \\t]*[,\\]\\}])/, 'number.hex'],\r\n            [/@numberInfinity(?=[ \\t]*[,\\]\\}])/, 'number.infinity'],\r\n            [/@numberNaN(?=[ \\t]*[,\\]\\}])/, 'number.nan'],\r\n            [/@numberDate(?=[ \\t]*[,\\]\\}])/, 'number.date']\r\n        ],\r\n        tagHandle: [\r\n            [/\\![^ ]*/, 'tag']\r\n        ],\r\n        anchor: [\r\n            [/[&*][^ ]+/, 'namespace']\r\n        ]\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.js?");

/***/ })

/******/ });