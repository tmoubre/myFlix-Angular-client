import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { FetchApiDataService } from '../../fetch-api-data.service';

/** Safely extract a readable message from various backend error shapes */
function getApiErrorMessage(err: any): string {
  try {
    const e = err?.error ?? err;
    if (!e) return '';
    if (typeof e === 'string') return e;
    if (typeof e?.message === 'string') return e.message;
    if (Array.isArray(e?.errors) && e.errors.length) {
      return e.errors.map((x: any) => x?.msg || x).join(', ');
    }
    return '';
  } catch {
    return '';
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  // If the component is shown in a dialog, this will exist; otherwise undefined (fine).
  dialogRef = inject(MatDialogRef<RegisterComponent>, { optional: true });

  loading = false;

  form = this.fb.group({
    userId: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthday: [''] // optional
  });

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const { userId, email, password, birthday } = this.form.value;

    this.api.registerUser({
      userId: String(userId ?? ''),
      email: String(email ?? ''),
      password: String(password ?? ''),
      birthDate: birthday ? String(birthday) : undefined
    }).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Account created! Please sign in.', 'OK', { duration: 2500 });
        this.dialogRef?.close(true);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        const apiMsg = getApiErrorMessage(err);
        const isDuplicate = err.status === 409 || /exist|already|duplicate/i.test(apiMsg);

        const msg = isDuplicate
          ? 'Could not create account: user already exists.'
          : (apiMsg || 'Could not create account. Please try again.');

        this.snack.open(msg, 'OK', { duration: 3500 });
        console.error(err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.dialogRef?.close();
  }
}

