# Change Log

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