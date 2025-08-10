// src/app/features/login-dialog/login-dialog.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Material modules used by the dialog
import { MatDialogModule }     from '@angular/material/dialog';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
  ],
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss']
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  form = this.fb.group({
    Username: ['', Validators.required],
    Password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    // TODO: call your FetchApiDataService.userLogin(...)
    this.snackbar.open('Logged in!', 'OK', { duration: 2000 });
  }
}

