import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { ServiceSnapshot } from '../../core/telemetry_stream';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-metric-tile',
  styleUrl: './metric-tile.scss',
  templateUrl: './metric-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricTile {
  // Signal inputs
  readonly snapshot = input.required<ServiceSnapshot>();
  readonly isSelected = input<boolean>(false);

  // Output API
  readonly selected = output<string>();

  // Derived state via pure computed signals
  protected readonly isCriticalCpu = computed(() => this.snapshot().cpuPercent > 80);
  protected readonly isHighLatency = computed(() => this.snapshot().latencyMs > 150);

  protected onCardClick(): void {
    this.selected.emit(this.snapshot().serviceId);
  }
}
