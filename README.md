CloudFormation IDE Tooling [![Build Status](https://travis-ci.org/keyboardDrummer/cloudformation-ide-tooling.svg?branch=master)](https://travis-ci.org/keyboardDrummer/Miksilo)
==========

#### DEMO
Try out the CloudFormation IDE in the browser [here](https://keyboarddrummer.github.io/cloudformation-ide-tooling/)

#### Repository structure
This project contains multiple sub-projects that provide rich editor tooling for [CloudFormation Templates](https://aws.amazon.com/cloudformation/resources/templates/) (CFT) for different editors. It contains the following sub-projects:
- [languageServer](languageServer): A CloudFormation Template LSP server that runs on Node and on the JVM.
- [vscode-extension](vscode-extension): A VS Code extension that provides rich editor tooling for CloudFormation Templates by using the Node or JVM CloudFormation Template LSP servers from the languageServer project.
- [browserLanguageServer](browserLanguageServer): A CloudFormation Template LSP server that runs in the browser.
- [browserClientExample](browserClientExample): A web application that uses the LSP server from browserLanguageServer, the [Monaco](https://github.com/microsoft/monaco-editor) editor, and a Monaco-LSP bridge provided by [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient), to provide an editor with rich CloudFormation Template support running completely in the browser.

### Getting started
This project uses the build tool [sbt](https://www.scala-sbt.org). To work with this project, make sure you've installed sbt.

#### VS Code
To try out the CFT language tooling in VS Code, make sure the VS Code executable `code` is available on your path and run 

`sbt languageServerJVM/fastvscode` or `sbt languageServerJS/fastvscode`

to start an instance of VS Code with language support for CloudFormation Templates, with the language support running on the JVM or Node respectively.

#### Browser
To try out the CFT language tooling in the browser,  run

`sbt browserLanguageServer/fastbrowser`

and once the local webserver is started navigate to the address it outputs.
