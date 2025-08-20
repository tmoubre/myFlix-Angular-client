/**
 * Source: src/app/app.component.ts
 * @packageDocumentation
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './features/navigation/navigation-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export /**
 * AppComponent: myFlix Angular component/service/model.
 */
class AppComponent {}



