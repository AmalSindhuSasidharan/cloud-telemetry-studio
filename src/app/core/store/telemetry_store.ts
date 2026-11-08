import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { ServiceSnapshot, TelemetryStream } from "../telemetry_stream";
import { computed, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";


export type StatusFilter = 'all' | 'healthy' | 'degraded' | 'critical';

export interface TelemetryStore {
    readonly snapshots: ServiceSnapshot[];
    readonly statusFilter: StatusFilter;
    readonly selectedServiceId: string | null;
    readonly searchQuery: string;
}

const initialState: TelemetryStore = {
    snapshots: [],
    statusFilter: 'all',
    selectedServiceId: null,
    searchQuery: '',
};

export const TelemetryStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(store=> ({
        // Derived filtered list of services based on status and search query
        filteredSnapshots: computed(()=>{
            const all = store.snapshots();
            const status = store.statusFilter();
            const query = store.searchQuery().toLowerCase().trim();

            return all.filter(snap=>{
                const matchesStatus = status === 'all' || snap.status === status;
                const matchesQuery = !query || snap.serviceName.toLowerCase().includes(query) ||
                    snap.serviceId.toLowerCase().includes(query);
                return matchesStatus && matchesQuery;
            });
        }),

        // High-level summary computations
        totalCount: computed(()=> store.snapshots().length),
        criticalCount: computed(()=> store.snapshots().filter(snap=> snap.status === 'critical').length),
        degradedCount: computed(()=> store.snapshots().filter(snap=> snap.status === 'degraded').length),
        clusterAvgLatency: computed(()=>{
            const all = store.snapshots();
            if(all.length === 0) return 0;
            const total = all.reduce((sum, item)=> sum+ item.latencyMs, 0);
            return Math.round(total/all.length);
        }),
    })),
    withMethods(store => ({
        // Actions to mutate state via immutable patchState
        setSnapshots(snapshots: ServiceSnapshot[]): void {
            patchState(store, { snapshots });
        },

        selectService(serviceId: string): void {
            patchState(store, state => ({
                selectedServiceId: state.selectedServiceId === serviceId ? null : serviceId
            }));
        },

        setStatusFilter(statusFilter: StatusFilter): void {
            patchState(store, { statusFilter });
        },

        setSearchQuery(searchQuery: string): void {
            patchState(store, { searchQuery });
        },
    })),
    withHooks({
        // Store automatically hooks into TelemetryStream on creation
        onInit(store, telemetryStream = inject(TelemetryStream)) {
            telemetryStream.metrics$
            .pipe(takeUntilDestroyed())
            .subscribe(metrics => {
                store.setSnapshots(metrics);
            });
        },
    }),
);