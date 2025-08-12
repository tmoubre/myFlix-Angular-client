import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService, RegisterPayload } from '../../fetch-api-data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: FetchApiDataService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      birthDate: [''] // optional
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const body: RegisterPayload = {
      userId: this.form.value.userId!,
      email: this.form.value.email!,
      password: this.form.value.password!,
      birthDate: this.form.value.birthDate || undefined
    };

    this.api.registerUser(body).subscribe({
      next: () => {
        this.snack.open('Account created. Please sign in.', 'OK', { duration: 3000 });
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.loading = false;
        // Friendly server error handling
        if (err?.status === 400 && typeof err.error === 'string') {
          this.snack.open(err.error, 'OK', { duration: 4000 }); // e.g. "<userId> already exists"
        } else if (err?.status === 422 && err?.error?.errors?.length) {
          const msg = err.error.errors.map((e: any) => e.msg).join(' • ');
          this.snack.open(msg, 'OK', { duration: 5000 });
        } else {
          this.snack.open('Could not create account. Please try again.', 'OK', { duration: 4000 });
        }
      }
    });
  }
}


