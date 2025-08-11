import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  FetchApiDataService,
  Movie,
  User
} from '../../../fetch-api-data.service'; // <-- fixed path (3 levels up)

import { MovieCardComponent } from '../movie-card/movie-card.component'; // <-- fixed path

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MovieCardComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  private api = inject(FetchApiDataService);
  private snackBar = inject(MatSnackBar);

  movies = signal<Movie[]>([]);
  user = signal<User | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchUser();
    this.fetchMovies();
  }

  private fetchUser(): void {
    this.api.getUser().subscribe({
      next: (u) => this.user.set(u),
      error: () => this.snackBar.open('Failed to load user', 'OK', { duration: 3000 })
    });
  }

  private fetchMovies(): void {
    this.loading.set(true);
    this.api.getAllMovies().subscribe({
      next: (data: Movie[]) => this.movies.set(data),
      error: () => this.snackBar.open('Failed to load movies', 'OK', { duration: 3000 }),
      complete: () => this.loading.set(false)
    });
  }

  isFavorite(movieId: string): boolean {
    const u = this.user();
    return !!u?.FavoriteMovies?.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    const u = this.user();
    if (!u) {
      this.snackBar.open('Please log in first', 'OK', { duration: 2500 });
      return;
    }

    const inFav = u.FavoriteMovies?.includes(movieId);
    const call = inFav
      ? this.api.removeFavorite(u.Username, movieId)
      : this.api.addFavorite(u.Username, movieId);

    call.subscribe({
      next: (updatedUser: User) => {
        this.user.set(updatedUser);
        this.snackBar.open(
          inFav ? 'Removed from favorites' : 'Added to favorites',
          'OK',
          { duration: 2000 }
        );
      },
      error: () => this.snackBar.open('Failed to update favorites', 'OK', { duration: 3000 })
    });
  }
}
