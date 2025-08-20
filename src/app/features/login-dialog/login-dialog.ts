/**
 * Source: src/app/features/login-dialog/login-dialog.ts
 * @packageDocumentation
 */
// src/app/features/login-dialog/login-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FetchApiDataService, LoginPayload, LoginResponse } from '../../fetch-api-data.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss']
})
export /**
 * LoginDialogComponent: myFlix Angular component/service/model.
 */
class LoginDialogComponent {
  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: FetchApiDataService,
    public ref: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown
  ) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const creds: LoginPayload = {
      userId: this.form.value.userId!,
      password: this.form.value.password!
    };
    this.loading = true;
    this.api.login(creds).subscribe({
      next: ({ user, token }: LoginResponse) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.ref.close(true);
      },
      error: () => (this.loading = false)
    });
  }
}


