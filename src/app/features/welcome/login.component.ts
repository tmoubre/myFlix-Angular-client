// src/app/features/welcome/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FetchApiDataService, Credentials, LoginResponse } from '../../fetch-api-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,            // keep this so router directives work elsewhere
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: []              // use [] to avoid missing-file errors
})
export class LoginComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: FetchApiDataService,
    private router: Router
  ) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const creds: Credentials = {
      userId: this.form.value.userId!,
      password: this.form.value.password!
    };

    this.api.login(creds).subscribe({
      next: ({ user, token }: LoginResponse) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigateByUrl('/movies');
      },
      error: () => (this.loading = false)
    });
  }

  // <-- Navigate to Register programmatically (always works)
  goRegister(): void {
    this.router.navigateByUrl('/register');
  }
}

