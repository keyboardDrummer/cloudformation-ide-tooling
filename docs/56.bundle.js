(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[56],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/st/st.js":
/*!********************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/st/st.js ***!
  \********************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/*---------------------------------------------------------------------------------------------\r\n *  Copyright (c) Microsoft Corporation. All rights reserved.\r\n *  Licensed under the MIT License. See License.txt in the project root for license information.\r\n *--------------------------------------------------------------------------------------------*/\r\n\r\nvar conf = {\r\n    comments: {\r\n        lineComment: '//',\r\n        blockComment: ['(*', '*)'],\r\n    },\r\n    brackets: [\r\n        ['{', '}'],\r\n        ['[', ']'],\r\n        ['(', ')'],\r\n        ['var', 'end_var'],\r\n        ['var_input', 'end_var'],\r\n        ['var_output', 'end_var'],\r\n        ['var_in_out', 'end_var'],\r\n        ['var_temp', 'end_var'],\r\n        ['var_global', 'end_var'],\r\n        ['var_access', 'end_var'],\r\n        ['var_external', 'end_var'],\r\n        ['type', 'end_type'],\r\n        ['struct', 'end_struct'],\r\n        ['program', 'end_program'],\r\n        ['function', 'end_function'],\r\n        ['function_block', 'end_function_block'],\r\n        ['action', 'end_action'],\r\n        ['step', 'end_step'],\r\n        ['initial_step', 'end_step'],\r\n        ['transaction', 'end_transaction'],\r\n        ['configuration', 'end_configuration'],\r\n        ['tcp', 'end_tcp'],\r\n        ['recource', 'end_recource'],\r\n        ['channel', 'end_channel'],\r\n        ['library', 'end_library'],\r\n        ['folder', 'end_folder'],\r\n        ['binaries', 'end_binaries'],\r\n        ['includes', 'end_includes'],\r\n        ['sources', 'end_sources']\r\n    ],\r\n    autoClosingPairs: [\r\n        { open: '[', close: ']' },\r\n        { open: '{', close: '}' },\r\n        { open: '(', close: ')' },\r\n        { open: '/*', close: '*/' },\r\n        { open: '\\'', close: '\\'', notIn: ['string_sq'] },\r\n        { open: '\"', close: '\"', notIn: ['string_dq'] },\r\n        { open: 'var_input', close: 'end_var' },\r\n        { open: 'var_output', close: 'end_var' },\r\n        { open: 'var_in_out', close: 'end_var' },\r\n        { open: 'var_temp', close: 'end_var' },\r\n        { open: 'var_global', close: 'end_var' },\r\n        { open: 'var_access', close: 'end_var' },\r\n        { open: 'var_external', close: 'end_var' },\r\n        { open: 'type', close: 'end_type' },\r\n        { open: 'struct', close: 'end_struct' },\r\n        { open: 'program', close: 'end_program' },\r\n        { open: 'function', close: 'end_function' },\r\n        { open: 'function_block', close: 'end_function_block' },\r\n        { open: 'action', close: 'end_action' },\r\n        { open: 'step', close: 'end_step' },\r\n        { open: 'initial_step', close: 'end_step' },\r\n        { open: 'transaction', close: 'end_transaction' },\r\n        { open: 'configuration', close: 'end_configuration' },\r\n        { open: 'tcp', close: 'end_tcp' },\r\n        { open: 'recource', close: 'end_recource' },\r\n        { open: 'channel', close: 'end_channel' },\r\n        { open: 'library', close: 'end_library' },\r\n        { open: 'folder', close: 'end_folder' },\r\n        { open: 'binaries', close: 'end_binaries' },\r\n        { open: 'includes', close: 'end_includes' },\r\n        { open: 'sources', close: 'end_sources' }\r\n    ],\r\n    surroundingPairs: [\r\n        { open: '{', close: '}' },\r\n        { open: '[', close: ']' },\r\n        { open: '(', close: ')' },\r\n        { open: '\"', close: '\"' },\r\n        { open: '\\'', close: '\\'' },\r\n        { open: 'var', close: 'end_var' },\r\n        { open: 'var_input', close: 'end_var' },\r\n        { open: 'var_output', close: 'end_var' },\r\n        { open: 'var_in_out', close: 'end_var' },\r\n        { open: 'var_temp', close: 'end_var' },\r\n        { open: 'var_global', close: 'end_var' },\r\n        { open: 'var_access', close: 'end_var' },\r\n        { open: 'var_external', close: 'end_var' },\r\n        { open: 'type', close: 'end_type' },\r\n        { open: 'struct', close: 'end_struct' },\r\n        { open: 'program', close: 'end_program' },\r\n        { open: 'function', close: 'end_function' },\r\n        { open: 'function_block', close: 'end_function_block' },\r\n        { open: 'action', close: 'end_action' },\r\n        { open: 'step', close: 'end_step' },\r\n        { open: 'initial_step', close: 'end_step' },\r\n        { open: 'transaction', close: 'end_transaction' },\r\n        { open: 'configuration', close: 'end_configuration' },\r\n        { open: 'tcp', close: 'end_tcp' },\r\n        { open: 'recource', close: 'end_recource' },\r\n        { open: 'channel', close: 'end_channel' },\r\n        { open: 'library', close: 'end_library' },\r\n        { open: 'folder', close: 'end_folder' },\r\n        { open: 'binaries', close: 'end_binaries' },\r\n        { open: 'includes', close: 'end_includes' },\r\n        { open: 'sources', close: 'end_sources' }\r\n    ],\r\n    folding: {\r\n        markers: {\r\n            start: new RegExp(\"^\\\\s*#pragma\\\\s+region\\\\b\"),\r\n            end: new RegExp(\"^\\\\s*#pragma\\\\s+endregion\\\\b\")\r\n        }\r\n    }\r\n};\r\nvar language = {\r\n    defaultToken: '',\r\n    tokenPostfix: '.st',\r\n    ignoreCase: true,\r\n    brackets: [\r\n        { token: 'delimiter.curly', open: '{', close: '}' },\r\n        { token: 'delimiter.parenthesis', open: '(', close: ')' },\r\n        { token: 'delimiter.square', open: '[', close: ']' }\r\n    ],\r\n    keywords: ['if', 'end_if', 'elsif', 'else', 'case', 'of', 'to', '__try', '__catch', '__finally',\r\n        'do', 'with', 'by', 'while', 'repeat', 'end_while', 'end_repeat', 'end_case',\r\n        'for', 'end_for', 'task', 'retain', 'non_retain', 'constant', 'with', 'at',\r\n        'exit', 'return', 'interval', 'priority', 'address', 'port', 'on_channel',\r\n        'then', 'iec', 'file', 'uses', 'version', 'packagetype', 'displayname',\r\n        'copyright', 'summary', 'vendor', 'common_source', 'from', 'extends'],\r\n    constant: ['false', 'true', 'null'],\r\n    defineKeywords: [\r\n        'var', 'var_input', 'var_output', 'var_in_out', 'var_temp', 'var_global',\r\n        'var_access', 'var_external', 'end_var',\r\n        'type', 'end_type', 'struct', 'end_struct', 'program', 'end_program',\r\n        'function', 'end_function', 'function_block', 'end_function_block',\r\n        'interface', 'end_interface', 'method', 'end_method',\r\n        'property', 'end_property', 'namespace', 'end_namespace',\r\n        'configuration', 'end_configuration', 'tcp', 'end_tcp', 'resource',\r\n        'end_resource', 'channel', 'end_channel', 'library', 'end_library',\r\n        'folder', 'end_folder', 'binaries', 'end_binaries', 'includes',\r\n        'end_includes', 'sources', 'end_sources',\r\n        'action', 'end_action', 'step', 'initial_step', 'end_step', 'transaction', 'end_transaction'\r\n    ],\r\n    typeKeywords: ['int', 'sint', 'dint', 'lint', 'usint', 'uint', 'udint', 'ulint',\r\n        'real', 'lreal', 'time', 'date', 'time_of_day', 'date_and_time', 'string',\r\n        'bool', 'byte', 'word', 'dword', 'array', 'pointer', 'lword'],\r\n    operators: ['=', '>', '<', ':', ':=', '<=', '>=', '<>', '&', '+', '-', '*', '**',\r\n        'MOD', '^', 'or', 'and', 'not', 'xor', 'abs', 'acos', 'asin', 'atan', 'cos',\r\n        'exp', 'expt', 'ln', 'log', 'sin', 'sqrt', 'tan', 'sel', 'max', 'min', 'limit',\r\n        'mux', 'shl', 'shr', 'rol', 'ror', 'indexof', 'sizeof', 'adr', 'adrinst',\r\n        'bitadr', 'is_valid', 'ref', 'ref_to'],\r\n    builtinVariables: [],\r\n    builtinFunctions: ['sr', 'rs', 'tp', 'ton', 'tof', 'eq', 'ge', 'le', 'lt',\r\n        'ne', 'round', 'trunc', 'ctd', 'сtu', 'ctud', 'r_trig', 'f_trig',\r\n        'move', 'concat', 'delete', 'find', 'insert', 'left', 'len', 'replace',\r\n        'right', 'rtc'],\r\n    // we include these common regular expressions\r\n    symbols: /[=><!~?:&|+\\-*\\/\\^%]+/,\r\n    // C# style strings\r\n    escapes: /\\\\(?:[abfnrtv\\\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,\r\n    // The main tokenizer for our languages\r\n    tokenizer: {\r\n        root: [\r\n            [/(\\.\\.)/, 'delimiter'],\r\n            [/\\b(16#[0-9A-Fa-f\\_]*)+\\b/, 'number.hex'],\r\n            [/\\b(2#[01\\_]+)+\\b/, 'number.binary'],\r\n            [/\\b(8#[0-9\\_]*)+\\b/, 'number.octal'],\r\n            [/\\b\\d*\\.\\d+([eE][\\-+]?\\d+)?\\b/, 'number.float'],\r\n            [/\\b(L?REAL)#[0-9\\_\\.e]+\\b/, 'number.float'],\r\n            [/\\b(BYTE|(?:D|L)?WORD|U?(?:S|D|L)?INT)#[0-9\\_]+\\b/, 'number'],\r\n            [/\\d+/, 'number'],\r\n            [/\\b(T|DT|TOD)#[0-9:-_shmyd]+\\b/, 'tag'],\r\n            [/\\%(I|Q|M)(X|B|W|D|L)[0-9\\.]+/, 'tag'],\r\n            [/\\%(I|Q|M)[0-9\\.]*/, 'tag'],\r\n            [/\\b[A-Za-z]{1,6}#[0-9]+\\b/, 'tag'],\r\n            [/\\b(TO_|CTU_|CTD_|CTUD_|MUX_|SEL_)[A_Za-z]+\\b/, 'predefined'],\r\n            [/\\b[A_Za-z]+(_TO_)[A_Za-z]+\\b/, 'predefined'],\r\n            [/[;]/, 'delimiter'],\r\n            [/[.]/, { token: 'delimiter', next: '@params' }],\r\n            // identifiers and keywords\r\n            [/[a-zA-Z_]\\w*/, {\r\n                    cases: {\r\n                        '@operators': 'operators',\r\n                        '@keywords': 'keyword',\r\n                        '@typeKeywords': 'type',\r\n                        '@defineKeywords': 'variable',\r\n                        '@constant': 'constant',\r\n                        '@builtinVariables': 'predefined',\r\n                        '@builtinFunctions': 'predefined',\r\n                        '@default': 'identifier'\r\n                    }\r\n                }],\r\n            { include: '@whitespace' },\r\n            [/[{}()\\[\\]]/, '@brackets'],\r\n            [/\"([^\"\\\\]|\\\\.)*$/, 'string.invalid'],\r\n            [/\"/, { token: 'string.quote', bracket: '@open', next: '@string_dq' }],\r\n            [/'/, { token: 'string.quote', bracket: '@open', next: '@string_sq' }],\r\n            [/'[^\\\\']'/, 'string'],\r\n            [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],\r\n            [/'/, 'string.invalid']\r\n        ],\r\n        params: [\r\n            [/\\b[A-Za-z0-9_]+\\b(?=\\()/, { token: 'identifier', next: '@pop' }],\r\n            [/\\b[A-Za-z0-9_]+\\b/, 'variable.name', '@pop']\r\n        ],\r\n        comment: [\r\n            [/[^\\/*]+/, 'comment'],\r\n            [/\\/\\*/, 'comment', '@push'],\r\n            [\"\\\\*/\", 'comment', '@pop'],\r\n            [/[\\/*]/, 'comment']\r\n        ],\r\n        comment2: [\r\n            [/[^\\(*]+/, 'comment'],\r\n            [/\\(\\*/, 'comment', '@push'],\r\n            [\"\\\\*\\\\)\", 'comment', '@pop'],\r\n            [/[\\(*]/, 'comment']\r\n        ],\r\n        whitespace: [\r\n            [/[ \\t\\r\\n]+/, 'white'],\r\n            [/\\/\\/.*$/, 'comment'],\r\n            [/\\/\\*/, 'comment', '@comment'],\r\n            [/\\(\\*/, 'comment', '@comment2'],\r\n        ],\r\n        string_dq: [\r\n            [/[^\\\\\"]+/, 'string'],\r\n            [/@escapes/, 'string.escape'],\r\n            [/\\\\./, 'string.escape.invalid'],\r\n            [/\"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]\r\n        ],\r\n        string_sq: [\r\n            [/[^\\\\']+/, 'string'],\r\n            [/@escapes/, 'string.escape'],\r\n            [/\\\\./, 'string.escape.invalid'],\r\n            [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]\r\n        ]\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./node_modules/monaco-editor/esm/vs/basic-languages/st/st.js?");

/***/ })

}]);