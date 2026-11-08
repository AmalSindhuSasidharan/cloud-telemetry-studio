import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StatusFilter, TelemetryStore } from '../../core/store/telemetry_store';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-filter-toolbar',
  styleUrl: './filter-toolbar.scss',
  templateUrl: './filter-toolbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterToolbar {
  // Inject the singleton store directly
  protected readonly store = inject(TelemetryStore);

  protected readonly filterOptions: Array<{ label: string; value: StatusFilter }> = [
    { label: 'All Nodes', value: 'all' },
    { label: 'Healthy', value: 'healthy' },
    { label: 'Degraded', value: 'degraded' },
    { label: 'Critical', value: 'critical' },
  ];

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.setSearchQuery(target.value);
  }

  protected onFilterChange(filter: StatusFilter): void {
    this.store.setStatusFilter(filter);
  }
}
