This repository provides rich editor tooling for CloudFormation Templates for different editors. It contains the following sub-projects:
- [languageServer](languageServer): A CloudFormation Template LSP server that runs on Node and on the JVM
- [vscode-extension](vscode-extension): A VS Code extension that provides rich editor tooling for CloudFormation Templates by using the Node CloudFormation languageServer
- [browserLanguageServer](browserLanguageServer): A CloudFormation Template LSP server that runs in the browser
- [browserClientExample](browserClientExample): A web application that uses the LSP server from browserLanguageServer and Monaco editor to provide an editor with rich CloudFormation Template support running completely in the browser
