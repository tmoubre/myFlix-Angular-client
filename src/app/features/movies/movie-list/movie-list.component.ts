import { Component, OnInit, OnDestroy, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

// ⬇️ Use the path that matches your project layout.
// If your service is at src/app/fetch-api-data.service.ts (most common):
import { FetchApiDataService } from '../../../fetch-api-data.service';
// If yours actually lives under src/app/features/, change the line above to:
// import { FetchApiDataService } from '../../fetch-api-data.service';

import { MovieCardComponent } from '../movie-card/movie-card.component';

type Movie = any;

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MovieCardComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Explicitly type the injected service to avoid "unknown" errors if the import path is wrong.
  private api: FetchApiDataService = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = false;
  movies: Movie[] = [];
  favoriteIds = new Set<string>();
  userId: string | null = null;

  // Dialog templates defined in the HTML
  @ViewChild('synopsisTpl') synopsisTpl!: TemplateRef<any>;
  @ViewChild('genreTpl')    genreTpl!: TemplateRef<any>;
  @ViewChild('directorTpl') directorTpl!: TemplateRef<any>;

  ngOnInit(): void {
    this.loading = true;

    const stored = this.safeParse(localStorage.getItem('user'));
    this.userId =
      stored?.userId ?? stored?.Username ?? stored?.username ?? stored?._id ?? null;

    const favList = stored?.favoriteMovies ?? stored?.FavoriteMovies ?? stored?.favorites ?? [];
    for (const f of Array.isArray(favList) ? favList : []) {
      if (typeof f === 'string') this.favoriteIds.add(f);
      else if (f?._id) this.favoriteIds.add(String(f._id));
      else if (f?.id) this.favoriteIds.add(String(f.id));
    }

    this.api.getAllMovies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: Movie[]) => {
          this.movies = Array.isArray(list) ? list : [];
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          console.error(err);
          this.snack.open('Could not load movies.', 'OK', { duration: 3000 });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Smooth horizontal scroll */
  scroll(container: HTMLElement, dir: 1 | -1): void {
    const amount = container.clientWidth * 0.9 * dir;
    container.scrollBy({ left: amount, behavior: 'smooth' });
  }

  /** Favorites */
  isFavorite(m: Movie): boolean {
    const id = m?._id ?? m?.id;
    return id ? this.favoriteIds.has(String(id)) : false;
  }

  toggleFavorite(m: Movie): void {
    const id = String(m?._id ?? m?.id ?? '');
    if (!id || !this.userId) {
      this.snack.open('Unable to update favorites.', 'OK', { duration: 2000 });
      return;
    }

    const isFav = this.favoriteIds.has(id);
    const req$ = isFav
      ? this.api.removeFavorite(this.userId, id)
      : this.api.addFavorite(this.userId, id);

    req$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (isFav) {
            this.favoriteIds.delete(id);
            this.snack.open('Removed from favorites', 'OK', { duration: 1500 });
          } else {
            this.favoriteIds.add(id);
            this.snack.open('Added to favorites', 'OK', { duration: 1500 });
          }
        },
        error: (err: any) => {
          console.error(err);
          this.snack.open('Could not update favorites.', 'OK', { duration: 2500 });
        }
      });
  }

  /** Modals (no extra files needed) */
  openDetails(m: Movie): void {
    const title = m?.Title ?? m?.title ?? 'Synopsis';
    const body =
      m?.Description ?? m?.description ?? m?.Summary ?? m?.summary ?? 'No synopsis available.';
    this.dialog.open(this.synopsisTpl, {
      data: { title, body },
      width: 'min(92vw, 560px)'
    });
  }

  openGenre(m: Movie): void {
    const name = m?.Genre?.Name ?? m?.genre?.name ?? 'Genre';
    const desc = m?.Genre?.Description ?? m?.genre?.description ?? 'No description available.';
    this.dialog.open(this.genreTpl, {
      data: { title: name, body: desc },
      width: 'min(92vw, 520px)'
    });
  }

  openDirector(m: Movie): void {
    const name  = m?.Director?.Name ?? m?.director?.name ?? 'Director';
    const bio   = m?.Director?.Bio ?? m?.director?.bio ?? '';
    const birth = m?.Director?.Birth ?? m?.director?.birth;
    const death = m?.Director?.Death ?? m?.director?.death;

    const lines = [
      bio && String(bio),
      birth ? `Born: ${birth}` : '',
      death ? `Died: ${death}` : ''
    ].filter(Boolean);

    this.dialog.open(this.directorTpl, {
      data: { title: name, body: lines.join('\n\n') || 'No details available.' },
      width: 'min(92vw, 560px)'
    });
  }

  trackById = (_: number, m: Movie) => m?._id ?? m?.id ?? _;

  private safeParse(json: string | null): any {
    try { return json ? JSON.parse(json) : null; } catch { return null; }
  }
}
