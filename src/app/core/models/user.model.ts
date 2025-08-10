export interface User {
  id: string;
  username: string;
  email: string;
  birthDate?: string;
  favoriteMovies: string[]; // array of Movie IDs
}
