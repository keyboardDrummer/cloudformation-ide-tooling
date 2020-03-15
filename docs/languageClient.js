"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc = require("vscode-jsonrpc");
const monaco_languageclient_1 = require("monaco-languageclient");
class ClientMessageWriter {
    constructor(worker) {
        this.worker = worker;
        this._onError = new rpc.Emitter();
        this.onError = this._onError.event;
        this._onClose = new rpc.Emitter();
        this.onClose = this._onClose.event;
    }
    write(msg) {
        const str = JSON.stringify(msg);
        this.worker.postMessage(str);
        console.log("client out:", str);
    }
    dispose() {
    }
}
class ClientMessageReader {
    constructor() {
        this._onError = new rpc.Emitter();
        this.onError = this._onError.event;
        this._onClose = new rpc.Emitter();
        this.onClose = this._onClose.event;
        this._onPartialMessage = new rpc.Emitter();
        this.onPartialMessage = this._onPartialMessage.event;
        this._listenCallback = null;
    }
    write(msg) {
        if (this._listenCallback) {
            this._listenCallback(JSON.parse(msg));
        }
    }
    listen(callback) {
        this._listenCallback = callback;
    }
    dispose() {
    }
}
function createLanguageClient(language) {
    const clientReader = new ClientMessageReader();
    var myWorker = new Worker('server.worker.bundle.js');
    myWorker.onmessage = (e) => clientReader.write(e.data);
    myWorker.postMessage(language);
    const clientWriter = new ClientMessageWriter(myWorker);
    let connection = rpc.createMessageConnection(clientReader, clientWriter);
    return new monaco_languageclient_1.MonacoLanguageClient({
        name: `${language} Language Client`,
        clientOptions: {
            // use a language id as a document selector
            documentSelector: [language],
            // disable the default error handler
            errorHandler: {
                error: () => monaco_languageclient_1.ErrorAction.Continue,
                closed: () => monaco_languageclient_1.CloseAction.DoNotRestart
            },
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(monaco_languageclient_1.createConnection(connection, errorHandler, closeHandler));
            }
        }
    });
}
exports.createLanguageClient = createLanguageClient;
//# sourceMappingURL=languageClient.js.map