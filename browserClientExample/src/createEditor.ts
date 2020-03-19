
import {
    MonacoServices
} from 'monaco-languageclient';
import * as monaco from "monaco-editor";

export function createEditor(element: HTMLElement, value: string, language: string) {
    const result: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(element, {
        model: monaco.editor.createModel(value, language, monaco.Uri.parse('inmemory://model.' + language)),
        glyphMargin: true,
        quickSuggestions: { other: true, comments: false, strings: true },
        gotoLocation: { multiple: 'gotoAndPeek' },
        minimap: { enabled: false},
        lightbulb: {
            enabled: true
        }
    });
    MonacoServices.install(result as any);
    return result;
}