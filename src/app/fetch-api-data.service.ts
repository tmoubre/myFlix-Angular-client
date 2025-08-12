// src/app/fetch-api-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie, normalizeMovies } from './models/movie.models';

const BASE = '/api'; // dev proxy to Heroku

export interface User {
  _id: string;
  userId: string;
  email: string;
  birthday?: string;        // note: backend stores birthDate; we can map later if needed
  favoriteMovies: string[];
}

export interface LoginPayload { userId: string; password: string; }
export type Credentials = LoginPayload;
export interface LoginResponse { user: User; token: string; }

export type UpdateUserPayload = Partial<{
  userId: string;
  email: string;
  birthday: string;        // UI name; backend expects birthDate
  password: string;
}>;

export interface RegisterPayload {
  userId: string;
  password: string;
  email: string;
  birthDate?: string;      // backend expects "birthDate"
}

@Injectable({ providedIn: 'root' })
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private get ls(): Storage | null { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; } }
  private get token(): string { return this.ls?.getItem('token') ?? ''; }
  private get storedUserId(): string | undefined {
    try { return JSON.parse(this.ls?.getItem('user') || 'null')?.userId; } catch { return undefined; }
  }
  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // ---- AUTH ----
  login(body: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE}/login`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // ---- REGISTER ----
  registerUser(body: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${BASE}/users`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // ---- MOVIES ----
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<any[]>(`${BASE}/movies`, { headers: this.authHeaders() })
      .pipe(map(normalizeMovies));
  }

  // ---- USERS ----
  getUser(userId?: string): Observable<User> {
    const id = userId ?? this.storedUserId;
    if (!id) throw new Error('No userId available for getUser()');
    return this.http.get<User>(`${BASE}/users/${encodeURIComponent(id)}`, { headers: this.authHeaders() });
  }

  updateUser(userId: string, payload: UpdateUserPayload): Observable<User> {
    // map UI "birthday" to backend "birthDate"
    const { birthday, ...rest } = payload;
    const body: any = { ...rest };
    if (birthday) body.birthDate = birthday;

    return this.http.put<User>(`${BASE}/users/${encodeURIComponent(userId)}`, body, {
      headers: this.authHeaders()
    });
  }

  addFavorite(userId: string, movieId: string): Observable<User> {
    return this.http.post<User>(
      `${BASE}/users/${encodeURIComponent(userId)}/favoriteMovies/${encodeURIComponent(movieId)}`,
      {},
      { headers: this.authHeaders() }
    );
  }

  removeFavorite(userId: string, movieId: string): Observable<User> {
    return this.http.delete<User>(
      `${BASE}/users/${encodeURIComponent(userId)}/favoriteMovies/${encodeURIComponent(movieId)}`,
      { headers: this.authHeaders() }
    );
  }

  deleteUser(userId: string): Observable<unknown> {
    return this.http.delete(`${BASE}/users/${encodeURIComponent(userId)}`, {
      headers: this.authHeaders()
    });
  }
}
