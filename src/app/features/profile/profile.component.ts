// src/app/features/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FetchApiDataService, User } from '../../fetch-api-data.service';
import { Movie } from '../../models/movie.models';
import { MovieDetailsDialog } from '../movies/movie-list/movie-details.dialog';

type UserWithDates = User & { birthDate?: string; birthday?: string };

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user?: UserWithDates;
  movies: Movie[] = [];
  favorites: Movie[] = [];
  saving = false;

  // bound to the form
  edit: Partial<{ userId: string; email: string; birthday: string; password: string }> = {};

  constructor(
    private api: FetchApiDataService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void { this.loadAll(); }

  private loadAll(): void {
    this.api.getUser().subscribe({
      next: (u) => {
        this.user = u as UserWithDates;
        this.fillFormFromUser(this.user);

        this.api.getAllMovies().subscribe({
          next: (list) => { this.movies = list; this.computeFavorites(); }
        });
      }
    });
  }

  /** Centralize how we copy values into the form */
  private fillFormFromUser(u: UserWithDates): void {
    const iso = this.getBirthdayIso(u);
    this.edit = {
      userId: u.userId,
      email: u.email,
      birthday: this.isoToDateInput(iso) // yyyy-MM-dd w/o timezone shift
    };
  }

  private computeFavorites(): void {
    const ids = this.user?.favoriteMovies ?? [];
    this.favorites = this.movies.filter(m => ids.includes(m._id));
  }

  /** ----- Favorites & Dialog ----- */
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
        favorite: this.isFavorite(m._id)
      }
    });

    ref.afterClosed().subscribe(result => {
      if (result?.toggle) this.toggleFavorite(m._id);
    });
  }

  isFavorite(id: string): boolean {
    return !!this.user?.favoriteMovies?.includes(id);
  }

  toggleFavorite(id: string): void {
    if (!this.user) return;
    const op$ = this.isFavorite(id)
      ? this.api.removeFavorite(this.user.userId, id)
      : this.api.addFavorite(this.user.userId, id);

    op$.subscribe({
      next: (u) => { this.user = u as UserWithDates; this.computeFavorites(); },
      error: () => this.snack.open('Could not update favorites', 'OK', { duration: 2200 })
    });
  }

  removeFavorite(id: string): void {
    if (!this.user) return;
    this.api.removeFavorite(this.user.userId, id).subscribe({
      next: (u) => {
        this.user = u as UserWithDates;
        this.computeFavorites();
        this.snack.open('Removed from favorites', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Could not remove favorite', 'OK', { duration: 2500 })
    });
  }

  /** ----- Profile Save/Delete ----- */
  save(): void {
    if (!this.user) return;
    this.saving = true;

    const payload: any = {
      userId: this.edit.userId?.trim(),
      email: this.edit.email?.trim(),
      // Send birthDate as ISO at UTC midnight to avoid off-by-one
      birthDate: this.edit.birthday ? this.dateInputToIso(this.edit.birthday) : undefined
    };
    if (this.edit.password?.trim()) payload.password = this.edit.password.trim();

    this.api.updateUser(this.user.userId, payload).subscribe({
      next: (u) => {
        // normalize locally (keep birthday/birthDate interchangeable)
        this.user = { ...(u as any), birthday: (u as any).birthday ?? (u as any).birthDate } as UserWithDates;
        this.fillFormFromUser(this.user);
        try { localStorage.setItem('user', JSON.stringify(this.user)); } catch {}
        this.computeFavorites();
        this.snack.open('Profile updated', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Could not update profile', 'OK', { duration: 2500 }),
      complete: () => (this.saving = false)
    });
  }

  deleteAccount(): void {
    if (!this.user) return;
    if (!confirm('Delete your account? This cannot be undone.')) return;

    this.api.deleteUser(this.user.userId).subscribe({
      next: () => {
        try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
        location.href = '/login';
      },
      error: () => this.snack.open('Could not delete account', 'OK', { duration: 2500 })
    });
  }

  /** ----- Helpers (timezone-safe date handling) ----- */
  private getBirthdayIso(u?: { birthday?: string; birthDate?: string }): string | undefined {
    return u?.birthday ?? u?.birthDate;
  }

  /** Convert ISO (e.g., 1967-05-12T00:00:00.000Z) → '1967-05-12' without TZ shift */
  private isoToDateInput(iso?: string): string | undefined {
    if (!iso) return undefined;
    const m = iso.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];

    // Fallback for odd strings: use UTC parts
    const d = new Date(iso);
    if (isNaN(d.getTime())) return undefined;
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
    const da = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${mo}-${da}`;
  }

  /** Convert 'yyyy-MM-dd' → ISO at UTC midnight (no local timezone math) */
  private dateInputToIso(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const ms = Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
    return new Date(ms).toISOString();
  }
}
