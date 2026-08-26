# Product Copy Guidelines (Item 128)

## Button Labels

Avoid generic labels. Use meaningful action verbs:

| Bad | Good |
|-----|------|
| Submit | Review Incident |
| Execute | Run Diagnostics |
| Save | Update Configuration |
| Delete | Retire Node |
| OK | Confirm Promotion |
| Cancel | Discard Changes |
| Add | Enroll Node |

## Status Labels

| Internal State | Display Label |
|---------------|---------------|
| operational | Online |
| degraded | Degraded |
| maintenance | In Service |
| provisioning | Setting Up |
| commissioning | Commissioning |
| retired | Retired |
| candidate | Detected |
| reviewing | Under Review |
| confirmed | Confirmed |
| false_positive | False Positive |

## Error Messages

Structure: What happened + Why + What to do

```
Clock synchronization lost.
GNSS signal interrupted 4 minutes ago.
[Retry Sync] [View Timing History]
```

## Tone

- Precise, not vague
- Calm, not alarming
- Helpful, not robotic
- Technical, not dumbed-down
