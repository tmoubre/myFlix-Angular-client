// src/app/core/fetch-api-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const API = 'https://YOUR_HOSTED_API_URL_HERE/'; // e.g., https://myflix-api.onrender.com/

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // -------- Auth --------
  userRegistration(user: any): Observable<any> {
    return this.http
      .post(API + 'users', user)
      .pipe(catchError(this.handleError));
  }

  userLogin(credentials: { Username: string; Password: string }): Observable<any> {
    return this.http
      .post(API + 'login', credentials)
      .pipe(catchError(this.handleError));
  }

  // -------- Movies --------
  getAllMovies(): Observable<any[]> {
    return this.http
      .get<any[]>(API + 'movies', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getMovieById(id: string): Observable<any> {
    return this.http
      .get(API + `movies/${id}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getDirector(name: string): Observable<any> {
    return this.http
      .get(API + `directors/${encodeURIComponent(name)}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getGenre(name: string): Observable<any> {
    return this.http
      .get(API + `genres/${encodeURIComponent(name)}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // -------- User --------
  getUser(username: string): Observable<any> {
    return this.http
      .get(API + `users/${encodeURIComponent(username)}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  updateUser(username: string, body: any): Observable<any> {
    return this.http
      .put(API + `users/${encodeURIComponent(username)}`, body, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  deleteUser(username: string): Observable<any> {
    return this.http
      .delete(API + `users/${encodeURIComponent(username)}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  addFavorite(username: string, movieId: string): Observable<any> {
    return this.http
      .post(API + `users/${encodeURIComponent(username)}/movies/${movieId}`, {}, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  removeFavorite(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(API + `users/${encodeURIComponent(username)}/movies/${movieId}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // -------- Helpers --------
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private extractResponseData(res: any): any {
    return res ?? {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client/network error:', error.error.message);
    } else {
      console.error(`API error ${error.status}:`, error.error || error.message);
    }
    return throwError(() => new Error('Request failed; please try again.'));
  }
}
