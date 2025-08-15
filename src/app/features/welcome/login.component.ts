/**
 * Source: src/app/features/welcome/login.component.ts
 * @file
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../../fetch-api-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  // If you DON'T have this file, either create it or remove this line:
  // styleUrls: ['./login.component.scss']
})
export /**
 * LoginComponent: myFlix Angular component/service/model.
 */
class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(FetchApiDataService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;

  form = this.fb.group({
    userId: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get f() { return this.form.controls; }

  ngOnInit() {
    // If already authenticated, skip login page
    if (localStorage.getItem('token')) {
      this.router.navigate(['/movies'], { replaceUrl: true });
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const { userId, password } = this.form.value;

    this.api.login({
      userId: String(userId ?? ''),
      password: String(password ?? '')
    }).subscribe({
      next: (res: any) => {
        // Persist auth BEFORE navigating
        localStorage.setItem('token', res?.token || '');
        localStorage.setItem('user', JSON.stringify(res?.user ?? null));

        this.snack.open('Welcome back!', 'OK', { duration: 1500 });
        this.router.navigate(['/movies'], { replaceUrl: true });
      },
      error: (err) => {
        this.snack.open(err?.error?.message || 'Login failed', 'OK', { duration: 2500 });
        console.error(err);
      },
      complete: () => { this.loading = false; }
    });
  }
}



