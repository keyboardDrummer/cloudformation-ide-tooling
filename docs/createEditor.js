"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monaco_languageclient_1 = require("monaco-languageclient");
const monaco = require("monaco-editor");
function createEditor(element, value, language) {
    const result = monaco.editor.create(element, {
        model: monaco.editor.createModel(value, language, monaco.Uri.parse('inmemory://model.' + language)),
        glyphMargin: true,
        quickSuggestions: { other: true, comments: false, strings: true },
        gotoLocation: { multiple: 'gotoAndPeek' },
        minimap: { enabled: false },
        lightbulb: {
            enabled: true
        }
    });
    monaco_languageclient_1.MonacoServices.install(result);
    return result;
}
exports.createEditor = createEditor;
//# sourceMappingURL=createEditor.js.map