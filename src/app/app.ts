import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardGrid } from './features/dashboard/dashboard-grid/dashboard-grid';

@Component({
  imports: [RouterOutlet, DashboardGrid],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('cloud-telemetry-studio');
}
