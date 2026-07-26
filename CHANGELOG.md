# Changelog

## 1.0.0

* Initial release of the project.
* Added the first version of the file-based logger.

## 1.0.1

* Improved the `LogEntity` constructor.
* Simplified entity creation and timestamp handling.

## 1.0.2

* Refactored the project structure following Clean Architecture principles.
* Separated the project into `domain` and `infrastructure` layers.

## 1.0.3

* Improved the `Logger` API.
* Replaced the generic `saveLog()` method with `info()`, `warn()`, and `error()` methods for a simpler and more intuitive developer experience.

## 1.1.0 - 2026-07-15

* Added `examples/` with basic usage examples.
* Added new severity levels: `debug`, `fatal`.
* Fixed validation in `LogEntity.fromJSON()` to handle invalid JSON.
* Improved the public API.

## 1.1.1 - 2026-07-17

* Added a `createLogger()` function for easier configuration.
* Improved the `Logger` API adding the `.getAllLogs()` method.

## 1.2.0 - 2026-07-21

* Added `CreateLoggerOptions` to simplify logger configuration.
* Refactored the file repository to use asynchronous file operations with `fs/promises`.
* Changed `createLogger()` to an asynchronous factory to ensure proper repository initialization.

## 1.3.0 - 2026-07-26

* Improved `CreateLoggerOptions` to better separate logger and repository configuration.
* Added `service` and `origin` metadata to log entries.