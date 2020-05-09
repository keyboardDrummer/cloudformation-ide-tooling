# AWS CloudFormation Templates for Visual Studio Code
This extension adds rich language support for AWS CloudFormation Templates to Visual Studio Code. It works for both JSON and YAML templates, as long as the file extensions are respectively `.cfn.json` or `.cfn.yaml`. Alternatively, you can set the language mode for a file to "CloudFormation JSON" or "CloudFormation YAML" using the language picker in the bottom right.

## Quick Start
1. Install the extension
2. Open any `.cf.json` or `.cf.yaml` file in VS Code.
3. Enjoy rich language tooling

## Language features

![Features demo](https://github.com/keyboardDrummer/cloudformation-ide-tooling/raw/master/vscode-extension/images/demo.gif)

- Auto-completion
- Go to Definition
- Find References
- Smart rename
- File outline
- Inline errors

These features work even when there are syntactic or semantic errors in your file.

## Contributing
The best way to contribute to this extensions is to use it and file issues on the GitHub repository. Thank you! Also please rate the extension and leave honest feedback, I'll be sure to read it.

## Architecture
This extension provides rich language support using a [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) server provided by [this project](../languageServer). It connects to that LSP server using [vscode-languageclient](https://www.npmjs.com/package/vscode-languageclient).

## Faster performance
This extension runs faster when Java is installed. It looks for the Java home directory in these locations:

1. the java.home setting in VS Code settings (workspace then user settings)
1. the `JDK_HOME` environment variable
1. the `JAVA_HOME` environment variable
1. on the current system path
