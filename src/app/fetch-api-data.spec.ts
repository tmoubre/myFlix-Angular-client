import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Use your actual API base:
const API = 'https://film-app-f9566a043197.herokuapp.com/';

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /** -------- AUTH -------- */

  // Matches your React login.jsx (userId/password, POST /login)
  userLogin(credentials: { userId: string; password: string }): Observable<any> {
    return this.http.post(API + 'login', credentials).pipe(catchError(this.handleError));
  }

  /** -------- MOVIES (examples; keep/add what you need) -------- */
  getAllMovies(): Observable<any[]> {
    return this.http.get<any[]>(API + 'movies', this.auth()).pipe(catchError(this.handleError));
  }

  /** -------- USER (examples) -------- */
  getUser(username: string): Observable<any> {
    return this.http.get(API + `users/${encodeURIComponent(username)}`, this.auth())
      .pipe(map(this.extract), catchError(this.handleError));
  }

  /** -------- Helpers -------- */
  private auth() {
    const token = localStorage.getItem('token') || '';
    return { headers:
