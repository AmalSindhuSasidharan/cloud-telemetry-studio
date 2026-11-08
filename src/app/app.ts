import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DashboardGrid } from './features/dashboard/dashboard-grid/dashboard-grid';
import { TopologyMap } from './features/topology-map/topology-map';
import { FilterToolbar } from './features/filter-toolbar/filter-toolbar';
import { TelemetryStore } from './core/store/telemetry_store';

@Component({
  imports: [DashboardGrid, TopologyMap, FilterToolbar],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(TelemetryStore);

  protected onServiceSelected(serviceId: string): void {
    this.store.selectService(serviceId);
  }
}
