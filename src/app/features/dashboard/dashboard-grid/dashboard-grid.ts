import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { TelemetryStream } from '../../../core/telemetry_stream';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-dashboard-grid',
  styleUrl: './dashboard-grid.scss',
  templateUrl: './dashboard-grid.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardGrid {
  private readonly telemetry = inject(TelemetryStream);

  // Convert cold observable stream into a read-only signal
  // Initialized with an empty array so template rendering is safe before the first emission
  protected readonly serviceSnapshots = toSignal(this.telemetry.metrics$, { initialValue: [] });

  // Track the currently selected service for inspection
  protected readonly selectedServiceId = signal<string | null>(null);

  protected selectService(serviceId: string | null): void {
    // if clicked again then deselect, otherwise select
    this.selectedServiceId.update((current) => (current === serviceId ? null : serviceId));
  }

  constructor() {
    console.log('DashboardGrid initialized with serviceSnapshots:', this.serviceSnapshots());
    setTimeout(() => {
      console.log('After 1 second, serviceSnapshots:', this.serviceSnapshots());
    }, 1000);
    setTimeout(() => {
      console.log('After 1 second, serviceSnapshots:', this.serviceSnapshots());
    }, 2000);
    setTimeout(() => {
      console.log('After 1 second, serviceSnapshots:', this.serviceSnapshots());
    }, 3000);
    setTimeout(() => {
      console.log('After 1 second, serviceSnapshots:', this.serviceSnapshots());
    }, 4000);
  }
}
