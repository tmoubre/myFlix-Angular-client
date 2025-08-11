// src/app/fetch-api-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// 🔁 Set this to your deployed API (keep the trailing slash)
const apiUrl = 'https://film-app-f9566a043197.herokuapp.com/';

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // ---- Helpers --------------------------------------------------------------

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Generic pass-through mapper (kept to mirror course pattern)
  private extractResponseData<T>(res: T): T {
    return (res as any) ?? {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client/network error:', error.error.message);
    } else {
      console.error(`API error ${error.status}:`, error.error || error.message);
    }
    return throwError(() => error);
  }

  // ---- Auth ---------------------------------------------------------------

  /** POST /users — Register a new user */
  userRegistration(userDetails: {
    Username: string;
    Password: string;
    Email: string;
    Birthday?: string;
  }): Observable<any> {
    return this.http
      .post(`${apiUrl}users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /** POST /login — Log in and receive token */
  userLogin(credentials: { Username: string; Password: string }): Observable<{ token: string; user: any }> {
    return this.http
      .post<{ token: string; user: any }>(`${apiUrl}login`, credentials)
      .pipe(catchError(this.handleError));
  }

  // ---- Movies -------------------------------------------------------------

  /** GET /movies — All movies */
  getAllMovies(): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiUrl}movies`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** GET /movies/:movieId — One movie by id */
  getOneMovie(movieId: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${encodeURIComponent(movieId)}`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** GET /directors/:name — Director details */
  getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${encodeURIComponent(name)}`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** GET /genres/:name — Genre details */
  getGenre(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}genres/${encodeURIComponent(name)}`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // ---- User ---------------------------------------------------------------

  /** GET /users/:username — Get user profile */
  getUser(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${encodeURIComponent(username)}`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** GET /users/:username/movies — Favorite movies for a user */
  getFavoriteMovies(username: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${apiUrl}users/${encodeURIComponent(username)}/movies`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** POST /users/:username/movies/:movieId — Add to favorites */
  addMovieToFavorites(username: string, movieId: string): Observable<any> {
    return this.http
      .post(`${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, null, {
        headers: this.authHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** DELETE /users/:username/movies/:movieId — Remove from favorites */
  deleteMovieFromFavorite(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, {
        headers: this.authHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** PUT /users/:username — Edit user */
  editUser(
    username: string,
    updates: Partial<{ Username: string; Password: string; Email: string; Birthday: string }>
  ): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${encodeURIComponent(username)}`, updates, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /** DELETE /users/:username — Delete user */
  deleteUser(username: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${encodeURIComponent(username)}`, { headers: this.authHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
}

