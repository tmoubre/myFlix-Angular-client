/**
 * Source: src/app/features/register/register.component.ts
 * @packageDocumentation
 */
import { Component, inject, Optional } from '@angular/core';
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
    if (typeof e === 'string') return e;
    if (e?.message) return e.message;
    if (e?.errors && typeof e.errors === 'object') {
      const first = Object.values(e.errors)[0] as any;
      return first?.message || 'Request failed';
    }
    if (err instanceof HttpErrorResponse && err.statusText) return err.statusText;
  } catch {}
  return 'Something went wrong';
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
  templateUrl: './register.component.html',
  // styleUrls: ['./register.component.scss'] // uncomment if the file exists
})
export /**
 * RegisterComponent: myFlix Angular component/service/model.
 */
class RegisterComponent {
  private fb = inject(FormBuilder);
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  constructor(@Optional() private dialogRef?: MatDialogRef<RegisterComponent>) {}

  loading = false;

  form = this.fb.group({
    userId: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthDate: [''] // optional
  });

  /** Getter used by template: f.userId, f.email, f.password */
  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = {
      userId: this.form.value.userId!,
      password: this.form.value.password!,
      email: this.form.value.email!,
      birthDate: this.form.value.birthDate || undefined
    };

    this.loading = true;
    this.api.registerUser(payload).subscribe({
      next: () => {
        this.snack.open('Account created! Please log in.', 'OK', { duration: 2000 });
        this.router.navigate(['/login']); // adjust route if your login page differs
        this.dialogRef?.close(true);
      },
      error: (err) => {
        const msg = getApiErrorMessage(err);
        this.snack.open(msg || 'Registration failed', 'OK', { duration: 3000 });
        console.error(err);
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  /** Used by template: (click)="goToLogin()" */
  goToLogin(): void {
    this.router.navigate(['/login']);
    this.dialogRef?.close();
  }
}


