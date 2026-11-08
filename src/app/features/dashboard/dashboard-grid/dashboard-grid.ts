import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MetricTile } from '../../../shared/metric-tile/metric-tile';
import { TelemetryStore } from '../../../core/store/telemetry_store';

@Component({
  imports: [MetricTile],
  selector: 'app-dashboard-grid',
  styleUrl: './dashboard-grid.scss',
  templateUrl: './dashboard-grid.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardGrid {
  // Inject centralized SignalStore
  protected readonly store = inject(TelemetryStore);

  protected handleSelectService(serviceId: string): void {
    this.store.selectService(serviceId);
  }
}
