import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService, Movie, User } from '../../fetch-api-data.service';
import { MovieCardComponent } from './movie-card.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MovieCardComponent],
  template: `
  <div style="padding:16px;">
    <div *ngIf="movies().length === 0">The list is empty!</div>
    <div class="grid">
      <app-movie-card
        *ngFor="let m of movies()"
        [movie]="m"
        [favorite]="isFavorite(m._id)"
        (toggleFavorite)="onToggleFavorite(m._id)">
      </app-movie-card>
    </div>
  </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
  `]
})
export class MovieListComponent implements OnInit {
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  movies = signal<Movie[]>([]);
  user = signal<User | null>(this.getStoredUser());

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token || !this.user()) {
      this.router.navigateByUrl('/');
      return;
    }

    this.api.getAllMovies().subscribe({
      next: (data) => this.movies.set(data),
      error: () => this.snack.open('Failed to load movies', 'Close', { duration: 3000 })
    });
  }

  isFavorite = (movieId: string) =>
    !!this.user()?.favoriteMovies?.includes(movieId);

  onToggleFavorite(movieId: string) {
    const u = this.user();
    if (!u) return;

    const inFav = u.favoriteMovies.includes(movieId);
    const call = inFav ? this.api.removeFavorite(u.userId, movieId)
                       : this.api.addFavorite(u.userId, movieId);

    call.subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.snack.open(inFav ? 'Removed from favorites' : 'Added to favorites', 'Close', { duration: 2000 });
      },
      error: () => this.snack.open('Failed to update favorites', 'Close', { duration: 3000 })
    });
  }

  private getStoredUser(): User | null {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  }
}
