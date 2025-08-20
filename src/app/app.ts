/**
 * Source: src/app/app.ts
 * @packageDocumentation
 */
// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export /**
 * App: myFlix Angular component/service/model.
 */
class App {
  protected readonly title = signal('myFlix-Angular-client');
}



