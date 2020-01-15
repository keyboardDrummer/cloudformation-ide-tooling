/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

(self as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}

import * as rpc from 'vscode-jsonrpc';
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
import { PartialMessageInfo } from "vscode-jsonrpc/lib/messageReader"
import * as monaco from "monaco-editor";

// register Monaco languages
monaco.languages.register({
    id: 'json',
    extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});

// create Monaco editor
const value = `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": "unix"
}`;
const editor = monaco.editor.create(document.getElementById("container")!, {
    model: monaco.editor.createModel(value, 'json', monaco.Uri.parse('inmemory://model.json')),
    glyphMargin: true,
    gotoLocation: { multiple: 'gotoAndPeek' },
    lightbulb: {
        enabled: true
    }
});

// install Monaco language client services
MonacoServices.install(editor);

class ClientMessageWriter implements rpc.MessageWriter  {

    _onError = new rpc.Emitter<[Error, rpc.Message | undefined, number | undefined]>()
    onError = this._onError.event;
    _onClose = new rpc.Emitter<void>()
    onClose = this._onClose.event;

    constructor(readonly worker: any) {

    }

    write(msg: rpc.Message): void {
        const str = JSON.stringify(msg)
        this.worker.postMessage(str)
        console.log("client out:", str)
    }

    dispose(): void {
    }
}

class ClientMessageReader implements rpc.MessageReader {
    _onError = new rpc.Emitter<Error>()
    onError: rpc.Event<Error> = this._onError.event
    _onClose = new rpc.Emitter<void>()
    onClose: rpc.Event<void> = this._onClose.event
    _onPartialMessage = new rpc.Emitter<PartialMessageInfo>()
    onPartialMessage = this._onPartialMessage.event;

    public write(msg: string): void {
        if (this._listenCallback) {
            this._listenCallback(JSON.parse(msg) as rpc.Message);
        }
    }

    _listenCallback: rpc.DataCallback | null = null;

    listen(callback: rpc.DataCallback): void {
        this._listenCallback = callback;
    }

    dispose(): void {
    }
}

const clientReader = new ClientMessageReader();
var myWorker = new Worker('server.worker.bundle.js');
myWorker.onmessage = (e) => clientReader.write(e.data);
const clientWriter: rpc.MessageWriter = new ClientMessageWriter(myWorker)

let connection: rpc.MessageConnection = rpc.createMessageConnection(clientReader, clientWriter);

const languageClient = createLanguageClient(connection);
const disposable = languageClient.start();
connection.onClose(() => disposable.dispose());

function createLanguageClient(connection: rpc.MessageConnection): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['json'],
            // disable the default error handler
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    });
}