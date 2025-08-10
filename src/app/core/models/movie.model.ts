export interface Movie {
  id: string;
  title: string;
  description: string;
  director: Director;
  genre: Genre;
  imageUrl: string;
  featured?: boolean;
}
