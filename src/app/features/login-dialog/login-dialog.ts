// src/app/features/login-dialog/login-dialog.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// ✅ Correct path from features/login-dialog -> app/
import { FetchApiDataService, Credentials, LoginResponse } from '../../fetch-api-data.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss'
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private api = inject(FetchApiDataService);
  private snack = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  form = this.fb.nonNullable.group({
    Username: ['', Validators.required],
    Password: ['', Validators.required]
  });

  submit() {
    const credentials: Credentials = this.form.getRawValue();

    // ✅ use the service's login(), not loginUser()
    this.api.login(credentials).subscribe({
      next: (res: LoginResponse) => {
        this.snack.open('Logged in', 'OK', { duration: 2000 });
        this.dialogRef.close(res.user);
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Login failed';
        this.snack.open(msg, 'Dismiss', { duration: 3000 });
      }
    });
  }
}
