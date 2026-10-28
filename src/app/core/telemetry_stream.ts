import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, share } from 'rxjs/operators';

export interface ServiceSnapshot {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly timestamp: number;
  readonly cpuPercent: number;
  readonly memoryMb: number;
  readonly latencyMs: number;
  readonly errorCount: number;
  readonly status: 'healthy' | 'degraded' | 'critical';
}

@Injectable({
  providedIn: 'root',
})
export class TelemetryStream {
  private readonly services = [
    {
      id: 'svc-auth',
      name: 'Auth Service',
      baseLatency: 35,
    },
    {
      id: 'svc-billing',
      name: 'Billing ENgine',
      baseLatency: 110,
    },
    {
      id: 'svc-database',
      name: 'PostgreSQL Primary',
      baseLatency: 12,
    },
    {
      id: 'svc-gateway',
      name: 'Edge Ingress Gateway',
      baseLatency: 18,
    },
    {
      id: 'svc-search',
      name: 'Vector Search index',
      baseLatency: 75,
    },
    {
      id: 'svc-worker',
      name: 'Async Background Pool',
      baseLatency: 220,
    },
  ];

  /**
   * Cold observable shared across all subscribers that produces real-time telemetry
   * snapshots every 500 milliseconds.
   */
  readonly metrics$: Observable<ServiceSnapshot[]> = interval(500).pipe(
    map(() => this.collectMetrics()),
    share(),
  );

  private collectMetrics(): ServiceSnapshot[] {
    const now = Date.now();
    return this.services.map((svc) => {
      // harmoninc wave funtion to simulate natural system load
      const variance = Math.sin(now / 4000) * 20;
      const noise = (Math.random() - 0.5) * 8;
      const cpu = Math.min(100, Math.max(5, Math.round(45 + variance + noise)));
      const latency = Math.max(5, Math.round(svc.baseLatency + variance * 2 + noise * 4));
      const errorCount = Math.random() > 0.88 ? Math.floor(Math.random() * 4) : 0;

      let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
      if (cpu > 80 || latency > 220 || errorCount > 2) {
        status = 'critical';
      } else if (cpu > 65 || latency > 130 || errorCount > 0) {
        status = 'degraded';
      }
      return {
        serviceId: svc.id,
        serviceName: svc.name,
        timestamp: now,
        cpuPercent: cpu,
        memoryMb: Math.round(512 + cpu * 16),
        latencyMs: latency,
        errorCount,
        status,
      };
    });
  }
}
