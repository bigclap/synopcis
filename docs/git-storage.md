# Git Repository Storage Guide

This document describes how article content is persisted inside local Git repositories.

## Repository Layout

* Every article is stored in its own **bare** repository located at `/data/git/<slug>.git`.
* The default branch is `main`. The bare repository head is configured automatically when the repository is initialised.
* Working copies are created on demand in the system temporary directory (`$GIT_WORKTREE_ROOT` or OS temp folder).

### Initialisation

Use `LocalGitRepositoryClient.initializeRepository(slug)` to create or reuse an article repository. The client wraps `git init --bare` and ensures that the default branch is set correctly. The helper also exposes `cloneRepository(slug, destination)` for producing a working tree that tracks the bare origin.

## Block Files

Each block is stored as an independent Markdown file. File paths follow the convention:

```
<lang>/b<NNN>-<label>.md
```

* `<lang>` — ISO language code (`en`, `ru`, ...).
* `<NNN>` — zero-padded block identifier (e.g. `b001`, `b023`).
* `<label>` — a slugified label derived from the user supplied name. Unicode characters are preserved; whitespace and punctuation collapse into dashes. Empty labels fall back to `untitled`.

Helpers:

* `formatBlockFilePath({ lang, blockId, label })` — returns a valid relative path for the block.
* `slugifyBlockLabel(label)` — converts arbitrary labels into safe slugs.

Alternatives simply create additional files for the same block id with different labels, e.g.

```
en/b001-introduction.md
en/b001-academic-tone.md
ru/b001-введение.md
```

## Commits and Metadata

Commits are created through `LocalGitRepositoryClient.commit` or `commitArticle`.

* The commit summary is automatically prefixed with the article slug: `[albert-einstein] Add introduction block`.
* Every commit message contains a `Source: <url>` footer as a human-readable backlink.
* Structured metadata is stored in the `Metadata:` footer as JSON:

```json
{
  "repository": "albert-einstein",
  "sourceUrl": "https://example.com/source",
  "files": [
    { "path": "en/b001-introduction.md", "action": "added" },
    { "path": "ru/b001-введение.md", "action": "added" }
  ]
}
```

The metadata keeps track of whether files were added, updated or removed. The history API parses the JSON and exposes it as strongly typed data.

## History, Diff and Retrieval

The client exposes high-level helpers:

* `history(slug, limit?)` — returns the newest commits with metadata, authorship and timestamps.
* `diff(slug, hash)` — produces a `git diff` for the specified commit (`hash^!`).
* `readFile(slug, path, ref?)` — reads files from any revision (defaults to `HEAD`).

These operations use `simple-git` under the hood and operate directly on bare repositories, so they do not require a working tree.

## Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `GIT_STORAGE_ROOT` | Root directory that stores bare repositories | `/data/git` |
| `GIT_WORKTREE_ROOT` | Parent directory for temporary working trees | system temp dir |
| `GIT_DEFAULT_BRANCH` | Default branch name | `main` |

## Tests

Automated Jest tests cover:

* Atomic storage of blocks inside language-specific directories.
* Preservation of alternative versions without overwriting existing files.
* History metadata parsing and diff generation.
* Cloning of bare repositories into working directories.

Run `npm test` from the `app` folder to execute the full suite.
