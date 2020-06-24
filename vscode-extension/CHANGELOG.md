# Change Log

## 0.0.20
- Update the CloudFormation resource specification to the latest version to include new constructs.

## 0.0.17
- Fix bugs in the YAML parser

## 0.0.16
- Introduce incremental parsing, greatly speeding up the parsing.

## 0.0.14
- Add a Node language server as a fallback for when Java is not installed.

## 0.0.12
- Improve parse speed for files with parse errors
- Add more telemetry
- Add a demo of features to the extension page

## 0.0.11
- Add basic telemetry if the user has enabled telemetry for VS Code

## 0.0.10
- Greatly improved parse time for files without parse errors

## 0.0.9
- Improve responsiveness when the user is typing by merging consecutive didChange notifications

## 0.0.8
- (again) Show code completion while typing, without requiring it to be invoked using ctrl+space

## 0.0.7
- Show code completion while typing, without requiring it to be invoked using ctrl+space

## 0.0.6
- Fixed a bug in the YAML parser that made it fail on compact block arrays, such as:
```yaml
Foo:
- Bar
  Baz
```

- Updated the CloudFormation resource specification to the latest us-east-1 version.

## 0.0.5

Fixed a critical issue that could prevent the extension from starting.