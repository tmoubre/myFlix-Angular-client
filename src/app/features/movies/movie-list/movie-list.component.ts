// src/app/features/movies/movie-list/movie-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FetchApiDataService, User } from '../../../fetch-api-data.service';
import { Movie } from '../../../models/movie.models';

import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieDetailsDialog } from './movie-details.dialog';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MovieCardComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  user?: User;
  loading = false;

  constructor(
    private api: FetchApiDataService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchUser();
    this.fetchMovies();
  }

  private fetchUser(): void {
    try {
      this.api.getUser().subscribe({
        next: (u) => (this.user = u),
        error: () => { /* ignore before login */ }
      });
    } catch {
      // thrown if no user is stored; safe to ignore on first load
    }
  }

  private fetchMovies(): void {
    this.loading = true;
    this.api.getAllMovies().subscribe({
      next: (list) => (this.movies = list),
      error: () => this.snack.open('Failed to load movies', 'OK', { duration: 3000 }),
      complete: () => (this.loading = false)
    });
  }

  isFavorite(movieId: string): boolean {
    return !!this.user?.favoriteMovies?.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    if (!this.user) {
      this.snack.open('Please sign in to manage favorites', 'OK', { duration: 3000 });
      return;
    }
    const inFav = this.isFavorite(movieId);
    const call$ = inFav
      ? this.api.removeFavorite(this.user.userId, movieId)
      : this.api.addFavorite(this.user.userId, movieId);

    call$.subscribe({
      next: (u) => (this.user = u),
      error: () => this.snack.open('Could not update favorites', 'OK', { duration: 3000 })
    });
  }

openDetails(m: Movie): void {
  const ref = this.dialog.open(MovieDetailsDialog, {
    width: 'min(1000px, 95vw)',
    maxHeight: '90vh',
    data: {
      title: m.title,
      description: m.description,
      image: m.ImageUrl,
      genreName: m.genre?.name ?? '',
      directorName: m.director?.name ?? '',
      favorite: this.isFavorite(m._id)   // <-- pass current state
    }
  });

  ref.afterClosed().subscribe(res => {
    if (res?.toggle) {
      this.toggleFavorite(m._id);       // <-- perform the add/remove
    }
  });
}

}
