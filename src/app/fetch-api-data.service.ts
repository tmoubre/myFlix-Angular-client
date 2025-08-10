// src/app/fetch-api-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
const apiUrl = environment.apiUrl;


// Optional: light typings so your components get IntelliSense
export interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Genre: { Name: string; Description: string };
  Director: { Name: string; Bio: string; Birth?: string; Death?: string };
  ImagePath?: string;
  Featured?: boolean;
}
export interface User {
  _id: string;
  Username: string;
  Email: string;
  Birthday?: string;
  FavoriteMovies: string[];
}

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  private base = environment.apiUrl.replace(/\/+$/, ''); // strip trailing slash

  constructor(private http: HttpClient) {}

  // ---------- helpers ----------
  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') ?? '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
  private extract<T>(res: T): T { return res || ({} as T); }
  private handleError(error: HttpErrorResponse) {
    const message =
      error.error?.message ??
      (typeof error.error === 'string' ? error.error : '') ||
      `Request failed (${error.status})`;
    return throwError(() => new Error(message));
  }

  // ---------- auth ----------
  registerUser(body: { Username: string; Password: string; Email: string; Birthday?: string }): Observable<User> {
    return this.http.post<User>(`${this.base}/users`, body).pipe(catchError(this.handleError));
  }

  loginUser(body: { Username: string; Password: string }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.base}/login`, body).pipe(catchError(this.handleError));
  }

  // ---------- movies ----------
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.base}/movies`, this.authHeaders())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  getOneMovie(title: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.base}/movies/${encodeURIComponent(title)}`, this.authHeaders())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  getDirector(name: string): Observable<Movie['Director']> {
    return this.http.get<Movie['Director']>(`${this.base}/movies/directors/${encodeURIComponent(name)}`, this.authHeaders())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  getGenre(name: string): Observable<Movie['Genre']> {
    return this.http.get<Movie['Genre']>(`${this.base}/movies/genres/${encodeURIComponent(name)}`, this.authHeaders())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  // ---------- users ----------
  getUser(username?: string): Observable<User> {
    const u = username ?? localStorage.getItem('user') ?? '';
    return this.http.get<User>(`${this.base}/users/${encodeURIComponent(u)}`, this.authHeaders())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  getFavoriteMovies(username?: string): Observable<string[]> {
    const u = username ?? localStorage.getItem('user') ?? '';
    return this.http.get<string[]>(`${this.base}/users/${encodeURIComponent(u)}/movies`, this.authHeaders())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  addFavoriteMovie(movieId: string, username?: string): Observable<User> {
    const u = username ?? localStorage.getItem('user') ?? '';
    return this.http.post<User>(`${this.base}/users/${encodeURIComponent(u)}/movies/${encodeURIComponent(movieId)}`, {}, this.authHeaders())
      .pipe(catchError(this.handleError));
  }

  removeFavoriteMovie(movieId: string, username?: string): Observable<User> {
    const u = username ?? localStorage.getItem('user') ?? '';
    return this.http.delete<User>(`${this.base}/users/${encodeURIComponent(u)}/movies/${encodeURIComponent(movieId)}`, this.authHeaders())
      .pipe(catchError(this.handleError));
  }

  editUser(update: Partial<Pick<User, 'Username' | 'Email' | 'Birthday'>> & { Password?: string }, username?: string): Observable<User> {
    const u = username ?? localStorage.getItem('user') ?? '';
    return this.http.put<User>(`${this.base}/users/${encodeURIComponent(u)}`, update, this.authHeaders())
      .pipe(catchError(this.handleError));
  }

  deleteUser(username?: string): Observable<{ message: string }> {
    const u = username ?? localStorage.getItem('user') ?? '';
    return this.http.delete<{ message: string }>(`${this.base}/users/${encodeURIComponent(u)}`, this.authHeaders())
      .pipe(catchError(this.handleError));
  }
}
