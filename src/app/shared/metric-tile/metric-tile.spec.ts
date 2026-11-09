import { TestBed } from '@angular/core/testing';
import { MetricTile } from './metric-tile';
import { ServiceSnapshot } from '../../core/telemetry_stream';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MetricTileHarness } from './testing/metric_tile_harness';

describe('MetricTile with ComponentHarness', () => {
  const healthySnapshot: ServiceSnapshot = {
    serviceId: 'svc-test',
    serviceName: 'Test Ingress Gateway',
    timestamp: 1000,
    cpuPercent: 42,
    memoryMb: 512,
    latencyMs: 35,
    errorCount: 0,
    status: 'healthy',
  };

  const criticalSnapshot: ServiceSnapshot = {
    ...healthySnapshot,
    cpuPercent: 95,
    latencyMs: 300,
    errorCount: 5,
    status: 'critical',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricTile],
      providers: [
        // Ensure unit tests run in zoneless mode matching production
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();
  });

  it('renders service name and status badge via harness', async () => {
    const fixture = TestBed.createComponent(MetricTile);
    fixture.componentRef.setInput('snapshot', healthySnapshot);

    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MetricTileHarness);

    expect(await harness.getServiceName()).toBe('Test Ingress Gateway');
    expect(await harness.getStatusBadgeText()).toBe('healthy');
    expect(await harness.hasErrorAlert()).toBe(false);
  });

  it('displays error alert when snapshot contains error', async () => {
    const fixture = TestBed.createComponent(MetricTile);
    fixture.componentRef.setInput('snapshot', criticalSnapshot);

    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MetricTileHarness);

    expect(await harness.getServiceName()).toBe('Test Ingress Gateway');
    expect(await harness.getStatusBadgeText()).toBe('critical');
    expect(await harness.hasErrorAlert()).toBe(true);
  });

  it('emit selected output event when tile is clicked', async () => {
    const fixture = TestBed.createComponent(MetricTile);
    fixture.componentRef.setInput('snapshot', healthySnapshot);

    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MetricTileHarness);

    let emittedId: string | null = null;
    fixture.componentInstance.selected.subscribe((id: string) => {
      emittedId = id;
    });

    await harness.click();
    expect(emittedId).toBe('svc-test');
  });

  it('reflect selected input state on the host container', async () => {
    const fixture = TestBed.createComponent(MetricTile);
    fixture.componentRef.setInput('snapshot', healthySnapshot);

    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MetricTileHarness);

    fixture.componentRef.setInput('snapshot', healthySnapshot);
    fixture.componentRef.setInput('isSelected', true);

    expect(await harness.isSelected()).toBe(true);
  });
});
