# Cloud Luxury Beauty Frontend

React + TypeScript frontend for the Cloud Luxury Beauty e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Run development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code

## Project Structure

```
src/
├── api/          # API client functions
├── components/   # Reusable components
├── context/      # React contexts
├── hooks/        # Custom hooks
├── pages/        # Page components
└── types/        # TypeScript types
```
