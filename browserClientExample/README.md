This project defines a web application that uses the LSP server from [browserLanguageServer](browserLanguageServer), the [Monaco](https://microsoft.github.io/monaco-editor/) editor, and a Monaco-LSP bridge provided by [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient), to provide an editor with rich CloudFormation Template support running completely in the browser.

It runs the LSP server in a webworker, which is defined in [server.worker.ts](src/server.worker.ts)
