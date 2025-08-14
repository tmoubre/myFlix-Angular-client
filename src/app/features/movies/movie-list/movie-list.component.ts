import { Component, OnInit, OnDestroy, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { FetchApiDataService } from '../../../fetch-api-data.service';
import { Movie } from '../../../models/movie.models';
import { MovieCardComponent } from '../movie-card/movie-card.component';

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
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = false;
  movies: Movie[] = [];
  favoriteIds = new Set<string>();

  /** Username string stored by your backend in the `userId` field (NOT Mongo `_id`). */
  userId: string | null = null;

  // Dialog templates defined in the HTML (if present)
  @ViewChild('synopsisTpl') synopsisTpl!: TemplateRef<any>;
  @ViewChild('genreTpl')    genreTpl!: TemplateRef<any>;
  @ViewChild('directorTpl') directorTpl!: TemplateRef<any>;

  ngOnInit(): void {
    this.loading = true;

    // Pull logged-in user from localStorage and grab username under `userId`
    const stored = this.safeParse(localStorage.getItem('user'));
    this.userId = stored?.userId ?? null;

    // Seed favorites from stored user
    const favList = stored?.favoriteMovies ?? stored?.FavoriteMovies ?? [];
    for (const f of Array.isArray(favList) ? favList : []) {
      if (typeof f === 'string') this.favoriteIds.add(f);
      else if (f?._id) this.favoriteIds.add(String(f._id));
      else if (f?.id) this.favoriteIds.add(String(f.id));
    }

    // Fetch movies and stop the spinner
    this.api.getAllMovies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (movies) => { this.movies = movies || []; },
        error: (err) => {
          console.error(err);
          this.snack.open('Failed to load movies', 'OK', { duration: 2500 });
        },
        complete: () => { this.loading = false; }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Horizontal scroll controls used by the template */
  scroll(container: HTMLElement, dir: number): void {
    if (!container) return;
    try {
      container.scrollBy({ left: dir * 320, behavior: 'smooth' } as ScrollToOptions);
    } catch {
      container.scrollLeft += dir * 320;
    }
  }

  /** Template helper: is a movie (or id) currently favorited? */
  isFavorite(m: Movie | string | undefined | null): boolean {
    const id = this.extractId(m);
    return id ? this.favoriteIds.has(id) : false;
  }

  /** Toggle heart; template may pass Movie or id */
  toggleFavorite(m: Movie | string): void {
    const id = this.extractId(m);
    if (!id) return;

    if (!this.userId) {
      this.snack.open('Please log in again.', 'OK', { duration: 2000 });
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

          // Keep localStorage.user.favoriteMovies in sync so Profile reflects changes immediately
          const stored = this.safeParse(localStorage.getItem('user')) || {};
          const current = this.extractIds(stored.favoriteMovies ?? stored.FavoriteMovies ?? []);
          const set = new Set(current.map(String));
          if (isFav) set.delete(String(id)); else set.add(String(id));
          (stored as any).favoriteMovies = Array.from(set);
          localStorage.setItem('user', JSON.stringify(stored));
        },
        error: (err: any) => {
          console.error(err);
          this.snack.open('Could not update favorites.', 'OK', { duration: 2500 });
        }
      });
  }

  /** Dialog helpers referenced by template; safe no-ops if templates not used */
  openDetails(m: Movie): void {
    if (!this.synopsisTpl) return;
    const title = (m as any)?.Title ?? (m as any)?.title ?? 'Details';
    const synopsis = (m as any)?.Description ?? (m as any)?.description ?? 'No synopsis available.';
    this.dialog.open(this.synopsisTpl, {
      data: { title, body: synopsis },
      width: 'min(92vw, 560px)'
    });
  }

  openGenre(m: Movie): void {
    if (!this.genreTpl) return;
    const name = (m as any)?.Genre?.Name ?? (m as any)?.genre?.name ?? 'Genre';
    const description = (m as any)?.Genre?.Description ?? (m as any)?.genre?.description ?? '';
    const body = [description].filter(Boolean).join('\n\n') || 'No details available.';
    this.dialog.open(this.genreTpl, {
      data: { title: name, body },
      width: 'min(92vw, 560px)'
    });
  }

  openDirector(m: Movie): void {
    if (!this.directorTpl) return;
    const name = (m as any)?.Director?.Name ?? (m as any)?.director?.name ?? 'Director';
    const bio = (m as any)?.Director?.Bio ?? (m as any)?.director?.bio;
    const birth = (m as any)?.Director?.Birth ?? (m as any)?.director?.birth;
    const death = (m as any)?.Director?.Death ?? (m as any)?.director?.death;
    const lines = [bio && `Bio: ${bio}`, birth && `Born: ${birth}`, death && `Died: ${death}`].filter(Boolean);
    this.dialog.open(this.directorTpl, {
      data: { title: name, body: lines.join('\n\n') || 'No details available.' },
      width: 'min(92vw, 560px)'
    });
  }

  trackById = (_: number, m: Movie) => (m as any)?._id ?? (m as any)?.id ?? _;

  private extractId(m: Movie | string | null | undefined): string | null {
    if (!m) return null;
    if (typeof m === 'string') return m;
    return (m as any)?._id ?? (m as any)?.id ?? null;
  }

  private extractIds(arr: any[]): string[] {
    if (!Array.isArray(arr)) return [];
    const out: string[] = [];
    for (const x of arr) {
      if (typeof x === 'string') out.push(x);
      else if (x?._id) out.push(String(x._id));
      else if (x?.id) out.push(String(x.id));
    }
    return out;
  }

  private safeParse(json: string | null): any {
    try { return json ? JSON.parse(json) : null; } catch { return null; }
  }
}
