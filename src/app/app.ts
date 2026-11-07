import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { DashboardGrid } from './features/dashboard/dashboard-grid/dashboard-grid';
import { ServiceSnapshot, TelemetryStream } from './core/telemetry_stream';
import { toSignal } from '@angular/core/rxjs-interop';
import { TopologyMap } from './features/topology-map/topology-map';

@Component({
  imports: [DashboardGrid, TopologyMap],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('cloud-telemetry-studio');

  private readonly telemetryStream = inject(TelemetryStream);
  protected readonly snapshots = toSignal(this.telemetryStream.metrics$, {
    initialValue: [] as ServiceSnapshot[],
  });

  protected readonly selectedServiceId = signal<string | null>(null);

  protected onServiceSelected(serviceId: string): void {
    this.selectedServiceId.update((current) => (current === serviceId ? null : serviceId));
  }
}
