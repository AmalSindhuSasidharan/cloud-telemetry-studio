import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ServiceSnapshot } from '../../core/telemetry_stream';

interface NodeCoordinate {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly label: string;
}

interface GraphLink {
  readonly source: NodeCoordinate;
  readonly target: NodeCoordinate;
}

@Component({
  imports: [],
  selector: 'app-topology-map',
  styleUrl: './topology-map.scss',
  templateUrl: './topology-map.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopologyMap {
  readonly snapshots = input.required<ServiceSnapshot[]>();
  readonly selectedServiceId = input<string | null>(null);
  readonly nodeSelected = output<string>();

  // Fixed layout coordinates for our 6 microservices
  private readonly nodeCoordinates: Record<string, { x: number; y: number }> = {
    'svc-auth': { x: 120, y: 150 },
    'svc-billing': { x: 480, y: 140 },
    'svc-database': { x: 300, y: 340 },
    'svc-gateway': { x: 300, y: 50 },
    'svc-search': { x: 120, y: 270 },
    'svc-worker': { x: 480, y: 270 },
  };

  // Microsservice dependency call graph
  private readonly dependencyEdges = [
    { from: 'svc-gateway', to: 'svc-auth' },
    { from: 'svc-gateway', to: 'svc-billing' },
    { from: 'svc-auth', to: 'svc-database' },
    { from: 'svc-billing', to: 'svc-database' },
    { from: 'svc-billing', to: 'svc-worker' },
    { from: 'svc-gateway', to: 'svc-search' },
  ];

  //Derived graph links computed from nodes.
  protected readonly links = computed<GraphLink[]>(() => {
    return this.dependencyEdges.map((edge) => ({
      source: {
        id: edge.from,
        x: this.nodeCoordinates[edge.from].x ?? 0,
        y: this.nodeCoordinates[edge.from].y ?? 0,
        label: edge.from,
      },
      target: {
        id: edge.to,
        x: this.nodeCoordinates[edge.to].x ?? 0,
        y: this.nodeCoordinates[edge.to].y ?? 0,
        label: edge.to,
      },
    }));
  });

  // Fast map of status lookups per service
  protected readonly snapshotMap = computed(() => {
    const map = new Map<string, ServiceSnapshot>();
    for (const snap of this.snapshots()) {
      map.set(snap.serviceId, snap);
    }
    return map;
  });

  protected getNodeStatus(serviceId: string): string {
    return this.snapshotMap().get(serviceId)?.status ?? 'healthy';
  }

  protected getNodeCoordinates(serviceId: string): { x: number; y: number } {
    return this.nodeCoordinates[serviceId] ?? { x: 0, y: 0 };
  }

  protected selectNode(serviceId: string): void {
    this.nodeSelected.emit(serviceId);
  }
}
