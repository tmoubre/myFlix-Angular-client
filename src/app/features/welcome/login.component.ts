import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../../fetch-api-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
  <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:1rem; max-width:360px; margin:2rem auto;">
    <mat-form-field appearance="fill">
      <mat-label>Username</mat-label>
      <input matInput formControlName="userId" required />
    </mat-form-field>
    <mat-form-field appearance="fill">
      <mat-label>Password</mat-label>
      <input matInput type="password" formControlName="password" required />
    </mat-form-field>
    <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Login</button>
  </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(FetchApiDataService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    userId: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.api.login(this.form.value as any).subscribe({
      next: ({ user, token }) => {
        if (user && token) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          this.router.navigateByUrl('/movies');
        } else {
          this.snack.open('No such user', 'Close', { duration: 3000 });
        }
      },
      error: () => this.snack.open('Something went wrong', 'Close', { duration: 3000 })
    });
  }
}
