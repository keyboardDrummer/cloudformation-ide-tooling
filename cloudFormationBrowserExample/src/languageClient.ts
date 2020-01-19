
import * as rpc from 'vscode-jsonrpc';
import { PartialMessageInfo } from "vscode-jsonrpc/lib/messageReader"
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    createConnection
} from 'monaco-languageclient';

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

export function createLanguageClient(language: string): MonacoLanguageClient {
    const clientReader = new ClientMessageReader();
    var myWorker = new Worker('server.worker.bundle.js');
    myWorker.onmessage = (e) => clientReader.write(e.data);
    myWorker.postMessage(language);
    const clientWriter: rpc.MessageWriter = new ClientMessageWriter(myWorker)

    let connection: rpc.MessageConnection = rpc.createMessageConnection(clientReader, clientWriter);
    return new MonacoLanguageClient({
        name: `${language} Language Client`,
        clientOptions: {
            // use a language id as a document selector
            documentSelector: [language],
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