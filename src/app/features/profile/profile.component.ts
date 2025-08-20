/**
 * Source: src/app/features/profile/profile.component.ts
 * @packageDocumentation
 */
// src/app/features/profile/profile.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { FetchApiDataService } from '../../fetch-api-data.service';
/** User document shape displayed on Profile. */
export type UserDoc = {
  _id: string;
  userId: string;   // username string (backend field)
  email: string;
  birthday?: string;
  favoriteMovies: string[]; // array of movie IDs
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
    // (Removed SynopsisDialogComponent to silence NG8113 warning)
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export /**
 * ProfileComponent: myFlix Angular component/service/model.
 */
class ProfileComponent {
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  loading = false;
  saving = false;

  user: UserDoc | null = null;

  // Two-way bound in the template
  edit: { birthday?: string; password?: string } = {};

  // Favorites rendered in the template
  favs: any[] = [];

  constructor() {
    this.loading = true;
    const stored = this.safeParse(localStorage.getItem('user'));
    if (stored) {
      const normalized: UserDoc = {
        _id: stored._id ?? stored.id,
        userId: stored.userId,
        email: stored.email ?? stored.Email,
        birthday: stored.birthday ?? stored.birthDate,
  /** Normalize various favorite movie id shapes (string or object) into string ids. */
        favoriteMovies: this.extractIds(stored.favoriteMovies ?? stored.FavoriteMovies ?? [])
      };
      this.user = normalized;
      this.edit.birthday = this.isoToDateInput(normalized.birthday);
    }
    this.loadFavorites();
  }

  /** Load full movie docs for the IDs in user.favoriteMovies */
  private loadFavorites(): void {
    if (!this.user || !Array.isArray(this.user.favoriteMovies) || this.user.favoriteMovies.length === 0) {
      this.favs = [];
      this.loading = false;
      return;
    }
    this.loading = true;
    const idSet = new Set(this.user.favoriteMovies.map(String));
    this.api.getAllMovies().subscribe({
      next: (all) => {
        const items = (all || []);
        this.favs = items.filter((m: any) => {
          const id = String(m?._id ?? m?.id ?? '');
          return id && idSet.has(id);
        });
      },
      error: (err) => {
        console.error(err);
        this.favs = [];
        this.snack.open('Failed to load favorites', 'OK', { duration: 2500 });
      },
      complete: () => (this.loading = false)
    });
  }

  /** Submit profile changes (no-op if your service doesn’t support it) */
  /** Persist profile changes via API and sync localStorage. */
  save(): void {
    if (!this.user) return;
    this.saving = true;

    const payload: any = {};
    if (this.edit.birthday) payload.birthDate = this.dateInputToIso(this.edit.birthday);
    if (this.edit.password) payload.password = this.edit.password;

    const done = () => { this.saving = false; this.snack.open('Updated', 'OK', { duration: 1500 }); };
    try {
      if (typeof (this.api as any).updateUser === 'function') {
        (this.api as any).updateUser(this.user.userId, payload).subscribe({
          next: (u: any) => {
            const normalized: UserDoc = {
              _id: u?._id ?? this.user!._id,
              userId: u?.userId ?? this.user!.userId,
              email: u?.email ?? this.user!.email,
              birthday: u?.birthday ?? u?.birthDate ?? this.user!.birthday,
              favoriteMovies: this.extractIds(u?.favoriteMovies ?? this.user!.favoriteMovies)
            };
            this.user = normalized;
            localStorage.setItem('user', JSON.stringify(normalized));
            this.loadFavorites();
            done();
          },
          error: (err: any) => { console.error(err); this.saving = false; this.snack.open('Update failed', 'OK', { duration: 2000 }); }
        });
      } else {
        done();
      }
    } catch (e) {
      console.error(e);
      this.saving = false;
      this.snack.open('Update failed', 'OK', { duration: 2000 });
    }
  }

  /** Delete the current user account after confirmation. */
  deleteAccount(): void {
    if (!this.user) return;
    if (typeof (this.api as any).deleteUser === 'function') {
      (this.api as any).deleteUser(this.user.userId).subscribe({
        next: () => { this.snack.open('Account deleted', 'OK', { duration: 1500 }); },
        error: (err: any) => { console.error(err); this.snack.open('Delete failed', 'OK', { duration: 2000 }); }
      });
    }
  }

  isFavorite(id: string): boolean {
    if (!this.user) return false;
    return (this.user.favoriteMovies || []).includes(String(id));
  }

  removeFavorite(id: string): void {
    if (!this.user) return;
    const userId = this.user.userId;
    this.api.removeFavorite(userId, id).subscribe({
      next: (u: any) => {
        // Update user + localStorage
        const favsIds = this.extractIds(u?.favoriteMovies ?? this.user!.favoriteMovies).filter(x => String(x) !== String(id));
        this.user = { ...(this.user as UserDoc), favoriteMovies: favsIds };
        localStorage.setItem('user', JSON.stringify(this.user));
        // Update visible favorites list
        this.favs = (this.favs || []).filter((m: any) => String(m?._id ?? m?.id ?? '') !== String(id));
        this.snack.open('Removed from favorites', 'OK', { duration: 1500 });
      },
      error: (err) => { console.error(err); this.snack.open('Could not update favorites.', 'OK', { duration: 2500 }); }
    });
  }

  /** Exists because the template calls (click)="openFavDetails(m)" */
  openFavDetails(_m: any): void {
    // No-op (or open a dialog if you want)
  }

  // ---- helpers ----
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

  private isoToDateInput(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
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

