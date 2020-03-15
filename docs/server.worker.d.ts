declare var require: any;
declare const BrowserAPI: any;
declare class ServerMessageWriter {
    write(msg: string): void;
    dispose(): void;
}
declare class ServerMessageReader {
    _promise: ((value: string) => void) | null;
    payloads: Array<string>;
    addPayload(value: string): void;
    nextPayload(): Promise<string>;
    private checkResolve;
}
//# sourceMappingURL=server.worker.d.ts.map