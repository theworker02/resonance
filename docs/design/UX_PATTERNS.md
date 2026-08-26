# Resonance UX Patterns

## Optimistic Updates (Item 72)

For safe, reversible actions (marking as read, toggling preferences, reordering), update the UI immediately while synchronizing in the background.

For dangerous actions (firmware update, deployment deletion, model promotion), display a confirmation dialog and wait for authoritative backend response before reflecting the change.

### Rules
- Optimistic: preferences, sort order, acknowledgements, note edits
- Authoritative: node retire, model promote, deployment delete, firmware push, permission change

## Offline Technician Mode (Item 73)

The technician mobile interface caches:
- Assigned node inventory
- Service procedures
- Recent diagnostics (last 24h)
- Calibration history

When offline, technicians can:
- Run local self-test via Bluetooth/USB
- Record service notes (synced on reconnect)
- View cached health history
- Complete maintenance checklists

## Empty States (Item 77)

Every empty screen MUST help the user take action.

| Screen | Empty State Message | Action |
|--------|-------------------|--------|
| Incidents | No incidents detected yet | Start simulation / Check node status |
| Fleet | No nodes registered | Enroll a node / Start simulator |
| Deployments | No deployments configured | Create deployment |
| Models | No models registered | Import model / Browse marketplace |
| Alerts | No alert policies configured | Create alert policy |
| Analytics | Insufficient data for analytics | Wait for observations / Adjust time range |

## Loading States (Item 78)

Never show a spinner alone. Use:
- **Skeleton screens** for initial page loads (show layout shape)
- **Progressive rendering** for data tables (headers first, rows stream in)
- **Contextual indicators** for in-place updates (subtle pulse on the updating element)
- **Optimistic placeholders** for newly created items (grey card while confirming)

## Error Recovery (Item 79)

Every error screen MUST offer at least one action:

```
Node cannot synchronize with GNSS.

[Retry Synchronization]  [View Timing Diagnostics]  [Mark for Service]
```

```
Model inference timed out.

[Retry]  [Use Fallback Model]  [Skip Classification]
```

Errors include: code, human message, whether retriable, and suggested recovery actions.

## Notification Center (Item 80)

Internal notification categories:
- **Operational**: deployment degraded, node offline, cell calibration needed
- **Security**: suspicious login, API key approaching expiry
- **System**: firmware available, model update, scheduled maintenance
- **Review**: incident pending review, feedback received

Notifications support: read/unread, dismiss, action link, bulk acknowledge.

## Data Visualization Language (Item 76)

Reusable visualization components (defined in Surface):
- `SignalPlot` — time-domain waveform
- `ConfidenceCurve` — confidence over time with hover annotations
- `EvidenceGraph` — node-edge relationship diagram
- `HealthGauge` — circular gauge (0-100) with color zones
- `Timeline` — vertical event timeline with detail expansion
- `DirectionPlot` — polar plot showing DOA with uncertainty cone
- `SpectrumView` — frequency domain visualization

All charts use Surface tokens for colors. No custom palettes.
