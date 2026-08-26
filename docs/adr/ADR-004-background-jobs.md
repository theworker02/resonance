# ADR-004: Background Job Framework

**Status:** Accepted  
**Date:** 2026-08-25

## Context

Several platform operations are long-running or deferrable: evidence export, model evaluation, firmware distribution, report generation, webhook delivery. These must not block API responses.

## Decision

Use BullMQ (Redis-backed) for background job processing. Jobs are organized into named queues by priority: critical, operations, model, export, maintenance, low-priority. Every job records status, attempts, duration, and errors. Failed jobs use exponential backoff with jitter. Permanent failures go to a dead-letter queue.

## Consequences

- API responses remain fast (job ID returned immediately)
- Job status is queryable
- Redis becomes a hard dependency for the Cloud service
- Requires monitoring of queue depth and failure rates
