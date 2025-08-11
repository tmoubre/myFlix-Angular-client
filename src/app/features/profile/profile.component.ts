import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FetchApiDataService,
  Movie,
  User,
  UpdateUserPayload
} from '../../fetch-api-data.service'; // <-- correct (2 levels up)

import { MovieCardComponent } from '../movies/movie-card/movie-card.component'; // <-- fixed path

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MovieCardComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private api = inject(FetchApiDataService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  user = signal<User | null>(null);
  movies = signal<Movie[]>([]);
  favMovies = computed(() => {
    const u = this.user();
    if (!u?.FavoriteMovies?.length) return [];
    const favSet = new Set(u.FavoriteMovies);
    return this.movies().filter(m => favSet.has(m._id));
  });

  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
    this.loadUser();
    this.loadMovies();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      Username: ['', [Validators.required]],
      Password: [''],
      Email: ['', [Validators.required, Validators.email]],
      Birthday: ['']
    });
  }

  private loadUser(): void {
    this.api.getUser().subscribe({
      next: (u: User) => {
        this.user.set(u);
        this.form.patchValue({
          Username: u.Username,
          Email: u.Email,
          Birthday: u.Birthday ? new Date(u.Birthday).toISOString().substring(0, 10) : ''
        });
      },
      error: () => this.snackBar.open('Failed to load user', 'OK', { duration: 3000 })
    });
  }

  private loadMovies(): void {
    this.api.getAllMovies().subscribe({
      next: (data: Movie[]) => this.movies.set(data),
      error: () => this.snackBar.open('Failed to load movies', 'OK', { duration: 3000 })
    });
  }

  isFavorite(movieId: string): boolean {
    const u = this.user();
    return !!u?.FavoriteMovies?.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    const u = this.user();
    if (!u) return;

    const inFav = u.FavoriteMovies?.includes(movieId);
    const call = inFav
      ? this.api.removeFavorite(u.Username, movieId)
      : this.api.addFavorite(u.Username, movieId);

    call.subscribe({
      next: (updated: User) => {
        this.user.set(updated);
        this.snackBar.open(
          inFav ? 'Removed from favorites' : 'Added to favorites',
          'OK',
          { duration: 2000 }
        );
      },
      error: () => this.snackBar.open('Could not update favorites', 'OK', { duration: 3000 })
    });
  }

  saveProfile(): void {
    const current = this.user();
    if (!current) return;

    const payload: UpdateUserPayload = {
      Username: this.form.value.Username,
      // Only send Password if provided
      ...(this.form.value.Password ? { Password: this.form.value.Password } : {}),
      Email: this.form.value.Email,
      Birthday: this.form.value.Birthday ? new Date(this.form.value.Birthday) : undefined
    };

    this.api.updateUser(current.Username, payload).subscribe({
      next: (updated: User) => {
        this.user.set(updated);
        this.snackBar.open('Profile updated', 'OK', { duration: 2000 });
      },
      error: () => this.snackBar.open('Update failed', 'OK', { duration: 3000 })
    });
  }

  deleteAccount(): void {
    const u = this.user();
    if (!u) return;

    this.api.deleteUser(u.Username).subscribe({
      next: () => {
        this.snackBar.open('Account deleted', 'OK', { duration: 2500 });
        // You might also want to clear localStorage and redirect here.
        localStorage.clear();
      },
      error: () => this.snackBar.open('Delete failed', 'OK', { duration: 3000 })
    });
  }
}
