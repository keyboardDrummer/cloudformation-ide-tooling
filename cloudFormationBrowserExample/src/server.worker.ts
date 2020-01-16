declare var require: any

const { BrowserAPI } = require("./server.js")

class ServerMessageWriter {
    write(msg: string): void {
        console.log("server out:", msg);
        postMessage(msg)
    }

    dispose(): void {
    }
}

class ServerMessageReader {

    _promise: ((value: string) => void) | null = null;
    payloads: Array<string>  = new Array<string>()

    public addPayload(value: string) {
        this.payloads.push(value)
        this.checkResolve();
    }

    public nextPayload(): Promise<string> {
        if (this._promise != null)
            throw new Error("woops")

        const promise = new Promise<string>((resolve, reject) => {
            this._promise = resolve;
        })
        this.checkResolve()
        return promise;
    }

    private checkResolve() {
        if (this._promise != null && this.payloads.length > 0) {
            const value = this.payloads.shift() as string
            this._promise(value)
            this._promise = null
        }
    }
}


const serverWriter = new ServerMessageWriter()
const serverReader = new ServerMessageReader();
onmessage = (e) => serverReader.addPayload(e.data)

fetch("CloudFormationResourceSpecification.json").then(async response => {
    const blob = await response.text()
    console.log("fetched resource specification, blob length is " + blob.length);
    BrowserAPI.jsonServer(serverReader, serverWriter, blob)
})