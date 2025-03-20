# Contributing to Podcast Teaching Demo

We love your input! We want to make contributing to Podcast Teaching Demo as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. Follow the PR template provided when creating a new pull request
2. Update the README.md with details of changes to the interface, if applicable
3. The PR will be merged once you have the sign-off of at least one other developer

## Branch Naming Convention

- Feature: `feature/description`
- Bug Fix: `fix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

Example: `feature/add-voice-selection`

## Commit Message Convention

Format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc)
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

Example:
```
feat(tts): add streaming support for local TTS

- Implemented chunk-based audio streaming
- Added progress indicators
- Updated documentation
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous operations

## Testing

- Write unit tests for new features
- Update existing tests when modifying features
- Ensure all tests pass before submitting PR
- Include both positive and negative test cases

## Documentation

- Update README.md if adding new features
- Document all public functions and components
- Include examples for complex features
- Keep documentation up to date with changes

## Issue Reporting

### Bug Reports

When filing an issue, make sure to answer these questions:

1. What version of Node.js are you using?
2. What operating system are you using?
3. What did you do?
4. What did you expect to see?
5. What did you see instead?

### Feature Requests

When suggesting a feature, include:

1. The problem you're trying to solve
2. Your proposed solution
3. Alternative solutions you've considered
4. Examples of similar features in other projects

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 