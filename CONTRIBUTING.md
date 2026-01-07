# Contributing to Cloud Luxury Beauty

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add feature: your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

Follow the setup instructions in [README.md](./README.md).

## Code Style

### TypeScript
- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### React
- Use functional components with hooks
- Keep components small and focused
- Use CSS Modules for styling
- Follow the existing component structure

### Backend
- Follow RESTful API conventions
- Use async/await for async operations
- Handle errors appropriately
- Add proper logging

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add wishlist functionality`
- `fix: Fix cart calculation bug`
- `docs: Update API documentation`
- `style: Format code with prettier`
- `refactor: Simplify product service`
- `test: Add tests for coupon service`

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Request review from maintainers

## Questions?

Open an issue for questions or discussions.
