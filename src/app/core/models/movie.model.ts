export interface Genre { Name: string; Description: string; }
export interface Director { Name: string; Bio: string; Birth?: string; Death?: string; }

export interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Genre: Genre;
  Director: Director;
  ImagePath?: string;
  Featured?: boolean;
}

