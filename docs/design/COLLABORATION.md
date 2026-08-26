# Collaboration Features (Items 115-117)

## Incident Notes
- Threaded notes on any incident
- @mentions notify referenced users
- Markdown support
- Attachments (images, PDFs — no audio by default)
- Notes are part of the audit trail

## Assignments
- Incidents can be assigned to a user
- Nodes can be assigned to a technician for service
- Assignments appear in the user's task queue

## Review Workflow States (Item 116)

```
Unreviewed → In Review → Reviewed → Needs Follow-up → Closed
```

Each transition records: who, when, and why.
Transitions are restricted by role:
- `operator` and `reviewer` can move to "In Review" and "Reviewed"
- Only `administrator` and `owner` can close

## Activity Feeds (Item 117)

Contextual feeds appear on:
- Incident detail: observation arrival, confidence changes, reviews, notes
- Node detail: health changes, calibration events, firmware updates
- Deployment detail: node additions/removals, degradation events
- Model detail: evaluations, promotions, shadow comparisons

Feed entries include: timestamp, actor, action, and optional detail expansion.
