// src/app/features/login-dialog/login-dialog.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Material modules used by the dialog
//import { MatDialogModule }     from '@angular/material/dialog';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../../fetch-api-data.service';

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
  private api = inject(FetchApiDataService);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  form = this.fb.group({
    Username: ['', Validators.required],
    Password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    // TODO: call your FetchApiDataService.userLogin(...)
    //this.snackbar.open('Logged in!', 'OK', { duration: 2000 });
    const credentials = this.form.getRawValue() as { Username: string; Password: string };
    this.api.loginUser(credentials).subscribe({
      next: ({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', user.Username);
        this.snackbar.open('Logged in!', 'OK', { duration: 2000 });
        this.dialogRef.close(user);
      },
      error: (err) => {
        this.snackbar.open(err.message, 'OK', { duration: 2000 });
      },
    });
  }
}

