/**
 * Source: src/app/models/user.model.ts
 * @file
 */
export interface User {
  id: string;
  username: string;
  email: string;
  birthDate?: string;
  favoriteMovies: string[]; // array of Movie IDs
}
