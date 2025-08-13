// src/app/features/welcome/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { RegisterComponent } from '../register/register.component'; 
import { FetchApiDataService } from '../../fetch-api-data.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  loading = false;

  form = this.fb.group({
    userId: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const { userId, password } = this.form.value;
    this.api.login({ userId: String(userId), password: String(password) }).subscribe({
      next: () => {
        this.snack.open('Welcome back!', 'OK', { duration: 2500 });
        this.router.navigateByUrl('/movies');
      },
      error: (err) => {
        this.loading = false;
        this.snack.open('Invalid credentials. Please try again.', 'OK', { duration: 3500 });
        console.error(err);
      }
    });
  }

  // NEW: open Register as a dialog
  openRegisterDialog(): void {
    this.dialog.open(RegisterComponent, { width: '360px' });
  }
}
