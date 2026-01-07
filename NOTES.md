# Development Notes

## Project Structure

This is a monorepo with separate backend and frontend workspaces.

## Database Migrations

Always create migrations for schema changes:
```bash
cd backend
npx prisma migrate dev --name migration_name
```

## Adding New Products

Products can be added via:
1. Admin dashboard UI
2. Direct database seeding
3. ProductImport service (for future API integrations)

## Styling Guidelines

- Use CSS Modules for component styles
- Follow the cloud-luxury color palette
- Maintain consistent spacing and typography
- Ensure responsive design on all components

## API Rate Limiting

Consider adding rate limiting for production:
- Auth endpoints: 5 requests/minute
- Product endpoints: 100 requests/minute
- Order endpoints: 10 requests/minute

## Security Considerations

- Never commit .env files
- Use strong JWT secrets in production
- Implement CSRF protection for production
- Add input validation on all endpoints
- Sanitize user inputs

## Performance

- Implement caching for product listings
- Use pagination for large datasets
- Optimize database queries
- Lazy load images
- Consider CDN for static assets

## Future Enhancements

- Email notifications
- Payment gateway integration
- Product reviews and ratings
- Social media integration
- Multi-language support
- Advanced analytics
