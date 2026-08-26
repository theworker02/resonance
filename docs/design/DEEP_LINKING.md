# Deep Linking & URL Structure (Item 113)

Every meaningful state in Resonance is shareable via URL.

## URL Patterns

| Resource | URL Pattern | Example |
|----------|-------------|---------|
| Organization | `/:org` | `/acme-research` |
| Workspace | `/:org/:workspace` | `/acme-research/north-campus` |
| Deployment | `/:org/:ws/deployments/:id` | `/acme-research/north-campus/deployments/dep-001` |
| Cell | `/:org/:ws/cells/:id` | `/acme-research/north-campus/cells/rc-204` |
| Node | `/:org/:ws/nodes/:id` | `/acme-research/north-campus/nodes/rn-f1-028` |
| Incident | `/:org/:ws/incidents/:id` | `/acme-research/north-campus/incidents/rsn-2026-001842` |
| Model | `/:org/:ws/models/:id` | `/acme-research/north-campus/models/acoustic-v5` |
| Alert policy | `/:org/:ws/settings/alerts/:id` | `/acme-research/north-campus/settings/alerts/ap-thermal` |
| API key | `/:org/settings/api-keys/:id` | `/acme-research/settings/api-keys/ak-prod-001` |

## Query Parameters

Preserved filters are encoded as query params:
```
/incidents?status=active&min_confidence=0.85&from=2026-08-01
```

## Tab State

Active tab within a detail view:
```
/incidents/rsn-2026-001842?tab=evidence
/nodes/rn-f1-028?tab=diagnostics
```

## Saved Views

Users can bookmark filter combinations. Saved views generate short URLs:
```
/views/my-high-confidence-incidents
```

## Implementation Rules
- Router reads org/workspace from URL segments (not session state alone)
- All filter state lives in the URL, not component state
- Back/forward navigation restores exact view state
- Sharing a URL gives the recipient the same view (subject to permissions)
