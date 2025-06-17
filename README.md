# Appwrite Next.js Tutorial

This project demonstrates how to build a simple user management system with **Next.js 15** and **TypeScript**. It uses a MongoDB database via Mongoose and showcases typical CRUD APIs for managing users. The front‑end is styled with Tailwind CSS and runs on the modern Next.js App Router.

## Features

- User registration and login with hashed passwords
- JWT based authentication helpers
- CRUD API routes under `/api/users`
- Profile pages built with React components
- Zod DTOs for request/response validation
- Tailwind CSS + PostCSS configuration

## Project Structure

```
src/
  app/            # Next.js app router pages and API routes
  components/     # React components (forms, profile UI, etc.)
  config/         # Database connection and other config helpers
  dto/            # Zod schemas for validating inputs/outputs
  helpers/        # Auth helper utilities
  lib/            # Example API clients for the front-end
  models/         # Mongoose models
```

## Getting Started

1. **Install dependencies**

```bash
npm install
# or
yarn install
```

2. **Create an `.env` file** with the following variables:

```
MONGO_URI=<your Mongo connection string>
JWT_SECRET=<secret used to sign JWTs>
```

3. **Run the development server**

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Linting and Build

- `npm run lint` – run ESLint using Next.js rules
- `npm run build` – create an optimized production build
- `npm start` – start the built application

## API Endpoints

- `POST /api/auth/signup` – create a new user
- `POST /api/auth/login` – authenticate a user and return a JWT token
- `GET /api/users` – list users with pagination and filters
- `GET /api/users/[id]` – retrieve a single user
- `PUT /api/users/[id]` – update user information
- `DELETE /api/users/[id]` – remove a user

All user routes require a valid JWT token supplied via a cookie or `Authorization` header.

## License

This tutorial project is provided for educational purposes without any warranty.
