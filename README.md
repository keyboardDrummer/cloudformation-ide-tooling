### Repository structure

This Repository is a collection of separate applications related to providing rich editor tooling for CloudFormation Templates. It contains:
- languageServer: A CloudFormation Template LSP server that runs on Node and on the JVM
- vscode-extension: A VS Code extension that provides rich editor tooling for CloudFormation Templates by using the Node CloudFormation languageServer
- browserLanguageServer: A CloudFormation Template LSP server that runs in the browser
- browserClientExample: A web application that uses the LSP server from browserLanguageServer and Monaco editor to provide an editor with rich CloudFormation Template support running completely in the browser