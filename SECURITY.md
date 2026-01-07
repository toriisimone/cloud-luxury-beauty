# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please do NOT open a public issue. Instead, please email security@cloudluxury.com with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Best Practices

### For Developers

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Keep dependencies updated**: Regularly update npm packages
3. **Validate inputs**: Always validate and sanitize user inputs
4. **Use HTTPS**: Always use HTTPS in production
5. **Implement rate limiting**: Protect API endpoints from abuse
6. **Regular security audits**: Run `npm audit` regularly

### For Deployment

1. **Strong secrets**: Use strong, randomly generated JWT secrets
2. **Database security**: Use strong database passwords and restrict access
3. **Environment variables**: Never expose .env files
4. **HTTPS only**: Enforce HTTPS in production
5. **CORS configuration**: Restrict CORS to trusted domains only
6. **Regular backups**: Maintain regular database backups

## Known Security Considerations

- JWT tokens expire after 15 minutes (access) and 7 days (refresh)
- Passwords are hashed using bcrypt
- SQL injection protection via Prisma ORM
- XSS protection via React's built-in escaping
- CSRF protection recommended for production

## Security Updates

We regularly update dependencies to address security vulnerabilities. Always keep your dependencies up to date:

```bash
npm audit
npm audit fix
```
