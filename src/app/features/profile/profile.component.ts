// src/app/features/profile/profile.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { FetchApiDataService } from '../../fetch-api-data.service';
import { SynopsisDialogComponent } from '../movies/dialogs/synopsis-dialog.component';

type UserDoc = {
  _id: string;
  userId: string;
  email: string;
  birthday?: string;   // UI field
  birthDate?: string;  // backend canonical
  favoriteMovies: string[]; // movie ids
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = true;
  saving = false;

  user: UserDoc | null = null;
  movies: any[] = [];
  favs: any[] = []; // favorite movie objects

  // banner edit model
  edit: { userId: string; email: string; birthday?: string; password?: string } = {
    userId: '',
    email: '',
    birthday: '',
    password: ''
  };

  ngOnInit(): void {
    const stored = this.safeParse(localStorage.getItem('user'));
    const userId = stored?.userId as string | undefined;
    if (!userId) { this.loading = false; return; }

    // Load user → movies → compute favorites
    this.api.getUser(userId).subscribe({
      next: (u) => {
        const normalized: UserDoc = { ...(u as any), birthday: (u as any).birthday ?? (u as any).birthDate };
        this.user = normalized;
        this.fillFormFromUser(normalized);

        this.api.getAllMovies().subscribe({
          next: (ms) => {
            this.movies = ms || [];
            this.computeFavorites();
            this.loading = false;
          },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  /** ---------- Favorites ---------- */
  private computeFavorites(): void {
    if (!this.user || !this.movies?.length) { this.favs = []; return; }
    const favIds = (this.user.favoriteMovies || []).map(x => String(x));
    const favSet = new Set(favIds);
    this.favs = (this.movies || []).filter(m => favSet.has(String(m?._id)));
  }

  isFavorite(id: string): boolean {
    return !!this.user?.favoriteMovies?.map(x => String(x)).includes(String(id));
  }

  toggleFavorite(id: string): void {
    if (!this.user) return;
    const userId = this.user.userId;

    const req$ = this.isFavorite(id)
      ? this.api.removeFavorite(userId, id)
      : this.api.addFavorite(userId, id);

    req$.subscribe({
      next: (u) => {
        const normalized: UserDoc = { ...(u as any), birthday: (u as any).birthday ?? (u as any).birthDate };
        this.user = normalized;
        this.computeFavorites();
        try { localStorage.setItem('user', JSON.stringify(this.user)); } catch {}
        const isNowFav = (this.user.favoriteMovies || []).map(x => String(x)).includes(String(id));
        this.snack.open(isNowFav ? 'Added to favorites' : 'Removed from favorites', 'OK', { duration: 1500 });
      },
      error: () => this.snack.open('Could not update favorites', 'OK', { duration: 2000 })
    });
  }

  removeFavorite(id: string): void {
    if (!this.user) return;
    this.api.removeFavorite(this.user.userId, id).subscribe({
      next: (u) => {
        const normalized: UserDoc = { ...(u as any), birthday: (u as any).birthday ?? (u as any).birthDate };
        this.user = normalized;
        this.computeFavorites();
        try { localStorage.setItem('user', JSON.stringify(this.user)); } catch {}
        this.snack.open('Removed from favorites', 'OK', { duration: 1500 });
      },
      error: () => this.snack.open('Could not remove favorite', 'OK', { duration: 2000 })
    });
  }

  /** ---------- Open movie info dialog from Profile ---------- */
  openFavDetails(m: any): void {
    this.dialog.open(SynopsisDialogComponent, {
      width: '520px',
      data: {
        title: m?.title ?? m?.Title ?? 'Synopsis',
        description: m?.Description ?? m?.description ?? 'No synopsis available.'
      }
    });
  }

  /** ---------- Profile edit & delete ---------- */
  save(): void {
    if (!this.user) return;
    this.saving = true;

    const payload: any = {
      userId: this.edit.userId?.trim(),
      email: this.edit.email?.trim(),
      birthDate: this.edit.birthday ? this.dateInputToIso(this.edit.birthday) : undefined
    };
    if (this.edit.password?.trim()) payload.password = this.edit.password.trim();

    this.api.updateUser(this.user.userId, payload).subscribe({
      next: (u) => {
        const normalized: UserDoc = { ...(u as any), birthday: (u as any).birthday ?? (u as any).birthDate };
        this.user = normalized;
        this.fillFormFromUser(normalized);
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
    // eslint-disable-next-line no-alert
    if (!confirm('Delete your account? This cannot be undone.')) return;

    this.api.deleteUser(this.user.userId).subscribe({
      next: () => {
        try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
        this.snack.open('Account deleted', 'OK', { duration: 2500 });
      },
      error: () => this.snack.open('Could not delete account', 'OK', { duration: 2500 })
    });
  }

  /** ---------- Helpers ---------- */
  private fillFormFromUser(u: UserDoc): void {
    this.edit = {
      userId: u.userId || '',
      email: u.email || '',
      birthday: this.isoToDateInput(this.getBirthdayIso(u)) || '',
      password: ''
    };
  }

  private getBirthdayIso(u?: { birthday?: string; birthDate?: string }): string | undefined {
    return u?.birthday || u?.birthDate || undefined;
  }

  private isoToDateInput(iso?: string): string | undefined {
    if (!iso) return undefined;
    const m = iso.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(iso);
    if (isNaN(d.getTime())) return undefined;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private dateInputToIso(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0));
    return dt.toISOString();
  }

  private safeParse(s: string | null): any {
    try { return s ? JSON.parse(s) : null; } catch { return null; }
  }
}

