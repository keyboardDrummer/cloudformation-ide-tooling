# AWS CloudFormation Templates for Visual Studio Code
This extension adds rich language support for AWS CloudFormation Templates to Visual Studio Code. It works for both JSON and YAML templates, as long as the file extensions are respectively `.cf.json` or `.cf.yaml`.

## Quick Start
1. Install the extension
2. Ensure that you have a version of the Java Runtime installed on your machine that is at least version 8.
3. Open any `.cf.json` or `.cf.yaml` file in VS Code. 

## Language features

![Features demo](../raw/master/extension/images/demo.gif)

- Auto-completion
- Go to Definition
- Find References
- Smart rename
- File outline
- Inline errors

These features work even when there are syntactic or semantic errors in your file.

## Configuring the JDK
This extension requires Java to run. It looks for the Java home directory in these locations:

1. the java.home setting in VS Code settings (workspace then user settings)
1. the `JDK_HOME` environment variable
1. the `JAVA_HOME` environment variable
1. on the current system path

## Contributing

The best way to contribute to this extensions is to use it and file issues on the GitHub repository. Thank you! Also please rate the extension and leave honest feedback, I'll be sure to read it.

## Repository structure
The folder CloudFormationLanguageServer contains the code that defines the CloudFormation language and starts a Node LSP server for that language.
The folder cloudFormationBrowserExample contains a web application that 
