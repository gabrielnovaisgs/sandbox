# Ticket: Core File Synchronization Engine

## Overview
We need to build a robust, decoupled **synchronization engine**. This core module will be responsible for moving data from a source to a destination. While we are starting with local directories, the architecture must remain **storage-agnostic**.

## Business Rules

- **Scope**: The engine must identify files in a source location and replicate them to a target location.
- **Abstraction**: The engine must not know it is talking to a disk. It should interact only with abstractions.
- **Efficiency**: File transfers must be performed using **streaming** to ensure a constant memory footprint, regardless of file size.
- **Metadata**: Every sync operation must generate a `manifest.json` in the target directory containing:
    - Filename
    - File size (in bytes)
    - Last modification timestamp
- **Reliability**: Any failure in a single file should be reported but should not necessarily halt the entire sync process (unless it's a structural failure).

## Input / Output

- **Input**: Two strings representing the paths (**Source** and **Destination**).
- **Output**: The physical files in the destination and a `manifest.json` file.

## Technical Constraints

- **Interfaces**: Define `StorageReader` and `StorageWriter`. Think about what methods are strictly necessary for the engine to do its job.
- **Standard Library**: Leverage the `io` package. Specifically, look into how `io.Reader` and `io.Writer` can be used to move data without loading it all into a `[]byte` slice.
- **Testing**: Prepare for **Table-Driven Tests**. Your logic should be testable without actually creating files on your physical hard drive during the test run.