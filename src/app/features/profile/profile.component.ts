import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FetchApiDataService, Movie, User } from '../../fetch-api-data.service';
import { MovieCardComponent } from '../movies/movie-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatDividerModule,
    MovieCardComponent
  ],
  template: `
  <div style="max-width:960px;margin:24px auto;padding:0 12px;">
    <mat-card>
      <mat-card-title>User Profile</mat-card-title>
      <mat-card-content>
        <div *ngIf="loading()">Loading...</div>
        <div *ngIf="error()" style="color:#c62828;">{{ error() }}</div>

        <ng-container *ngIf="!editing(); else editForm">
          <p><strong>UserId:</strong> {{ user()?.userId }}</p>
          <p><strong>Email:</strong> {{ user()?.email }}</p>
          <p><strong>BirthDate:</strong> {{ birthDate() }}</p>

          <h3 style="margin-top:24px;">Favorite Movies</h3>
          <div *ngIf="favoriteMovies().length === 0">You have no favorite movies yet.</div>
          <div class="grid">
            <app-movie-card
              *ngFor="let m of favoriteMovies()"
              [movie]="m"
              [favorite]="true"
              (toggleFavorite)="toggleFavorite(m._id)">
            </app-movie-card>
          </div>

          <div style="display:flex; gap:12px; margin-top:24px;">
            <button mat-raised-button color="primary" (click)="editing.set(true)">Edit Profile</button>
            <button mat-raised-button color="warn" (click)="confirmDelete()">Delete Account</button>
            <button mat-stroked-button (click)="logout()">Logout</button>
          </div>
        </ng-container>

        <ng-template #editForm>
          <form [formGroup]="form" (ngSubmit)="save()"
                style="display:grid; gap:12px; max-width:480px;">
            <mat-form-field appearance="fill">
              <mat-label>Username</mat-label>
              <input matInput formControlName="userId" />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Birthday</mat-label>
              <input matInput type="date" formControlName="birthDate" />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>New password</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Confirm new password</mat-label>
              <input matInput type="password" formControlName="confirm" />
            </mat-form-field>

            <div style="display:flex; gap:12px;">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save Changes</button>
              <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
            </div>
          </form>
        </ng-template>
      </mat-card-content>
    </mat-card>
  </div>
  `,
  styles: [`
    .grid {
      display:grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 12px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private api = inject(FetchApiDataService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  user = signal<User | null>(this.getStoredUser());
  movies = signal<Movie[]>([]);
  favoriteMovies = signal<Movie[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  editing = signal<boolean>(false);

  form = this.fb.group({
    userId: ['',[Validators.required, Validators.minLength(3)]],
    email: ['',[Validators.required, Validators.email]],
    birthDate: [''],
    password: [''],
    confirm: ['']
  });

  ngOnInit() {
    const u = this.user();
    const token = localStorage.getItem('token');
    if (!u || !token) { this.router.navigateByUrl('/'); return; }

    // seed form
    this.form.patchValue({
      userId: u.userId,
      email: (u as any).email || '',
      birthDate: this.toDateInput((u as any).birthDate)
    });

    // load movies to compute favorites
    this.loading.set(true);
    this.api.getAllMovies().subscribe({
      next: (list) => {
        this.movies.set(list);
        this.syncFavorites();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load movies');
        this.loading.set(false);
      }
    });
  }

  birthDate = computed(() => {
    const bd = (this.user() as any)?.birthDate;
    try {
      if (!bd) return '';
      return new Date(bd).toISOString().split('T')[0];
    } catch { return ''; }
  });

  toggleFavorite(movieId: string) {
    const u = this.user(); if (!u) return;
    const inFav = u.favoriteMovies?.includes(movieId);
    const call = inFav ? this.api.removeFavorite(u.userId, movieId)
                       : this.api.addFavorite(u.userId, movieId);

    call.subscribe({
      next: (updated) => {
        this.user.set(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        this.syncFavorites();
        this.snack.open(inFav ? 'Removed from favorites' : 'Added to favorites', 'Close', { duration: 2000 });
      },
      error: () => this.snack.open('Failed to update favorites', 'Close', { duration: 3000 })
    });
  }

  save() {
    if (this.form.value.password && this.form.value.password !== this.form.value.confirm) {
      this.snack.open('Passwords do not match', 'Close', { duration: 3000 }); return;
    }
    const current = this.user(); if (!current) return;

    const payload: any = {
      userId: this.form.value.userId!,
      email: this.form.value.email!,
      birthDate: this.form.value.birthDate || ''
    };
    if (this.form.value.password) payload.password = this.form.value.password;

    this.loading.set(true);
    this.api.updateUser(current.userId, payload).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.user.set(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        this.editing.set(false);
        this.snack.open('Profile updated', 'Close', { duration: 2000 });
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('Failed to update your profile', 'Close', { duration: 3000 });
      }
    });
  }

  cancel() {
    const u = this.user(); if (!u) return;
    this.form.patchValue({
      userId: u.userId,
      email: (u as any).email || '',
      birthDate: this.toDateInput((u as any).birthDate),
      password: '',
      confirm: ''
    });
    this.editing.set(false);
  }

  confirmDelete() {
    const u = this.user(); if (!u) return;
    const ok = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!ok) return;

    this.loading.set(true);
    this.api.deleteUser(u.userId).subscribe({
      next: () => {
        this.loading.set(false);
        this.logout();
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('Failed to delete account', 'Close', { duration: 3000 });
      }
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/'); // back to login
  }

  private syncFavorites() {
    const u = this.user(); if (!u) { this.favoriteMovies.set([]); return; }
    const favIds = new Set(u.favoriteMovies || []);
    const unique = this.movies().filter(m => favIds.has(m._id));
    this.favoriteMovies.set(unique);
  }

  private toDateInput(val?: string) {
    try { return val ? new Date(val).toISOString().split('T')[0] : ''; }
    catch { return ''; }
  }

  private getStoredUser(): User | null {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  }
}
