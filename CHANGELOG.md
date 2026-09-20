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

## 1.3.1 - 2026-07-30

* Added validation for persisted log entries.

## 1.4.0 - 2026-08-01

* Added new method `deleteLogs()`.
* Refactored file repository path unions.

## 1.4.1 - 2026-08-07

* Refactored log filtering with the new `FilterLogsOptions` type.
* Refactored the `Logger` API to use `getLogs()` for filtered and unfiltered reads.
* Refactored the file repository read and delete flow to reuse shared filtering logic.
* Refactored domain types into `domain/types/enums` and `domain/types/interfaces`.
* Improved `LogEntity` validation and age filtering helpers.

## 1.5.0 - 2026-08-29

* Added a transport-based repository factory to support file-backed logging configuration more cleanly.
* Split datasource and repository responsibilities to follow a clearer architecture.
* Added compatibility for the legacy `file` configuration while keeping the modern `transport` shape.
* Refined the public logger configuration API and documentation.
* Added and corrected example scripts and test coverage for the datasource and logger flow.
* Ensured the project passes its test suite and build validation.

## 1.5.1 - 2026-08-30

* Refactored architecture and standardized barrel imports

## 1.6.0 - 2026-09-02

* Added MongoDB as a second log transport.
* Added MongoDB connection configuration through `createLogger()`.
* Added MongoDB persistence for reading, writing, and deleting logs.
* Added database-level filtering by severity, origin, and age.
* Added a Mongoose schema for persisted log entries.

## 1.6.1 - 2026-09-20

* Refactored file datasource for better efficiency.
* Added more options for file-based logging.