export const metadata = {
  title: "Reliable Refunds for POS",
  description: "Idempotent refund flow across aggregators.",
};

# Reliable Refunds for POS

**Problem**  
Refunds were failing in flaky networks and double-charging on retries.

**Approach**

- Idempotency keys at request + DB layer
- Retry with backoff on Kafka consumer
- Outbox pattern for aggregator callbacks

**Result**

- Refund success stabilized at 99.9% API success
- Supported load spikes during sales without duplicate charges

_Tech:_ Python, Kafka, Redis, MySQL
