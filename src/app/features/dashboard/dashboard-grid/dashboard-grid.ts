import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { TelemetryStream } from '../../../core/telemetry_stream';
import { toSignal } from '@angular/core/rxjs-interop';
import { MetricTile } from '../../../shared/metric-tile/metric-tile';

@Component({
  imports: [MetricTile],
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

  protected readonly criticalCount = computed(
    () => this.serviceSnapshots().filter((snap) => snap.status === 'critical').length,
  );
  protected readonly degradedCount = computed(
    () => this.serviceSnapshots().filter((snap) => snap.status === 'degraded').length,
  );
  protected readonly healthyCount = computed(
    () => this.serviceSnapshots().filter((snap) => snap.status === 'healthy').length,
  );
}
