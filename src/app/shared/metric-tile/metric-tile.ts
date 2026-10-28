import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';


@Component({
  imports: [DecimalPipe],
  standalone: true,
  selector: 'app-metric-tile',
  styleUrl: './metric-tile.scss',
  templateUrl: './metric-tile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricTile {}
