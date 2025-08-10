# myFlix Angular Client

An Angular front-end for the **myFlix** movie API. This project re-implements the myFlix React client using Angular, TypeScript, and Angular Material.

## Overview

The application allows users to:
- Register a new account  
- Log in and authenticate  
- View all movies  
- View detailed information about a single movie, including its director and genre  
- Add or remove movies from their list of favourites  
- View and update their profile, including deleting their account  

## Tech Stack
- **Angular** (latest CLI version)
- **TypeScript**
- **Angular Material** for UI components
- **RxJS** for async handling
- **Angular Router** for navigation

## API
The app consumes the hosted myFlix API:  
`https://film-app-f9566a043197.herokuapp.com/`

Endpoints include:
- `POST /users` – Register user
- `POST /login` – Authenticate
- `GET /movies` – Get all movies
- `GET /movies/:id` – Get a single movie
- `GET /movies/directors/:name` – Get director details
- `GET /movies/genres/:name` – Get genre details
- `GET /users/:username` – Get user profile
- `POST /users/:username/favoriteMovies/:movieId` – Add favourite
- `DELETE /users/:username/favoriteMovies/:movieId` – Remove favourite
- `PUT /users/:username` – Update profile
- `DELETE /users/:username` – Delete account

## Current Features Implemented
- Angular project scaffolding (`ng new myFlix-Angular-client`)
- Routing configured for:
  - Login
  - Movie list
  - Profile
- Service (`fetch-api-data.service.ts`) with HttpClient for API calls
- Angular Material UI modules integrated
- AuthInterceptor for attaching JWT token
- Basic navigation bar

## To-Do
- Complete the profile update and delete functionality in Angular
- Add single movie view, director view, and genre view
- Implement favourite toggle on movie cards
- Style components with Angular Material for a consistent UI

## Setup
```bash
# Clone repo
git clone <your-repo-url>
cd myFlix-Angular-client

# Install dependencies
npm install

# Run dev server
ng serve --open
```

## Environment
For now, the API URL is hard-coded into `fetch-api-data.service.ts`.  
In production, move it to `src/environments/environment.ts` for easier configuration.
