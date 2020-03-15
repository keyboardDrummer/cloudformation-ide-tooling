"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { BrowserAPI } = require("./server.js");
class ServerMessageWriter {
    write(msg) {
        console.log("server out:", msg);
        postMessage(msg);
    }
    dispose() {
    }
}
class ServerMessageReader {
    constructor() {
        this._promise = null;
        this.payloads = new Array();
    }
    addPayload(value) {
        this.payloads.push(value);
        this.checkResolve();
    }
    nextPayload() {
        if (this._promise != null)
            throw new Error("woops");
        const promise = new Promise((resolve, reject) => {
            this._promise = resolve;
        });
        this.checkResolve();
        return promise;
    }
    checkResolve() {
        if (this._promise != null && this.payloads.length > 0) {
            const value = this.payloads.shift();
            this._promise(value);
            this._promise = null;
        }
    }
}
onmessage = (e) => {
    const serverConstructor = e.data === "json" ? BrowserAPI.jsonServer.bind(BrowserAPI) : BrowserAPI.yamlServer.bind(BrowserAPI);
    const serverWriter = new ServerMessageWriter();
    const serverReader = new ServerMessageReader();
    onmessage = (e) => serverReader.addPayload(e.data);
    fetch("CloudFormationResourceSpecification.json").then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const blob = yield response.text();
        console.log("fetched resource specification, blob length is " + blob.length);
        serverConstructor(serverReader, serverWriter, blob);
    }));
};
//# sourceMappingURL=server.worker.js.map