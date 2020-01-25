This repository provides rich editor tooling for CloudFormation Template (CFT) for different editors. It contains the following sub-projects:
- [languageServer](languageServer): A CloudFormation Template LSP server that runs on Node and on the JVM.
- [vscode-extension](vscode-extension): A VS Code extension that provides rich editor tooling for CloudFormation Templates by using the Node CloudFormation Templates LSP server from the languageServer project.
- [browserLanguageServer](browserLanguageServer): A CloudFormation Template LSP server that runs in the browser.
- [browserClientExample](browserClientExample): A web application that uses the LSP server from browserLanguageServer, the [Monaco](https://github.com/microsoft/monaco-editor) editor, and a Monaco-LSP bridge provided by [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient), to provide an editor with rich CloudFormation Template support running completely in the browser.
