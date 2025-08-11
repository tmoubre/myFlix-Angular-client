// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './features/navigation/navigation-bar.component';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { LoginDialogComponent } from './features/login-dialog/login-dialog.component';
import { MovieListComponent } from './features/movies/movie-list/movie-list.component';
import { MovieCardComponent } from './features/movies/movie-card/movie-card.component';
import { ProfileComponent } from './features/profile/profile.component';

// Services
import { FetchApiDataService } from './fetch-api-data.service';

// Routes
const routes = [
  { path: '', component: WelcomeComponent },
  { path: 'movies', component: MovieListComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    WelcomeComponent,
    LoginDialogComponent,
    MovieListComponent,
    MovieCardComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    // Material modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [FetchApiDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
