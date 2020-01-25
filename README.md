This repository is a collection of separate applications related to providing rich editor tooling for CloudFormation Templates. It contains:
- [languageServer](languageServer/README.md): A CloudFormation Template LSP server that runs on Node and on the JVM
- [vscode-extension](vscode-extension/README.md): A VS Code extension that provides rich editor tooling for CloudFormation Templates by using the Node CloudFormation languageServer
- [browserLanguageServer](browserLanguageServer/README.md): A CloudFormation Template LSP server that runs in the browser
- [browserClientExample](browserClientExample/README.md): A web application that uses the LSP server from browserLanguageServer and Monaco editor to provide an editor with rich CloudFormation Template support running completely in the browser
