# CloudTelemetry Studio

> High-throughput, real-time distributed telemetry dashboard build with Modern Angular, fine-grained Signals, and Zoneless Change Detection.

[![Angular Version](https://img.shields.io/badge/Angular-19-dd0031.svg)](https://angular.dev)

---

## Architectural Overview

CloudTelemetry Studio visualizes high-frequency system telemetry (CPU, memory, tail latencies, error budgets) across microservice nodes without the performance overhead of legacy dirty-checking engines.

### Key Architectural Pillars
- **Zoneless Fine-Grained Reactivity:** Zero Zone.js overhead. State changes trigger direct DOM modifications via `signal()`, `computed()`, and `linkedSignal()`.
- **Hybrid Streaming Pipeline:** High-frequency raw data streams managed via RxJS observables and bridged cleanly to template signals via `@angular/core/rxjs-interop`.
- **Deferred Loading (`@defer`):** Heavy visualization components are lazily-loaded on viewport intersection, optimizing bundle size and Core Web Vitals.
- **Enterprise Signal Store:** State isolation using `@ngrx/signals`, providing deep immutability, selectors and entity adapters.
- **Component Test Harness:** UI components tested via black-box harnesses (`@angular/cdk/testing) to eliminate brittle DOM queries.

---

## Project Structure

```text
src/app/
+-- core/                           # Singleton services, streaming engines
|    +-- telemetry_streams.ts
+-- features/                       # Feature slices
|    +-- dashboard/                 # Main telemetry grid
|    +-- topology_map/              # Microservice topology visualizer
+-- shared/                         # Presentation components and utility directives    
+-- main.ts                         # Application entry point
```
---

## Getting Started

### Prerequisites
- Node.js >=20.x
- npm >= 10.x

### Installation and Run
```bash
# Clone the repository
git clone https://github.com/amalsindhusasidharan/cloud-telemetry-studio.git
cd cloud-telemetry-studio

# Install dependencies
npm install

# Start local dev server
npm start
```

Access the applciation at http://localhost:4200/.

### Testing
```bash
# Run unit and harness test suites
npm test
```
### Clean Baseline Commit on `main`

Run the following commands in your terminal:

```bash
# 1. Format all project files
npx prettier --write

# 2. Stage all modifications and additions
git add .

# 3. Create foundational baseline commit
git commit -m "chore: config prettier, install cdk and ngrx-signals, establish base readme"
```
