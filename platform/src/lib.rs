//! Resonance Platform — spatial intelligence, correlation, incidents, and API.
//!
//! This is the backend brain of the Resonance system. It receives directional
//! observations from edge nodes, correlates them across spatial cells, applies
//! environmental compensation, fuses evidence into incidents, and exposes
//! everything through a REST/WebSocket API.

pub mod atmosphere;
pub mod cells;
pub mod chronos;
pub mod correlation;
pub mod incidents;
pub mod nodecare;
pub mod provenance;

// Re-export key types
pub use atmosphere::AtmosphereEngine;
pub use chronos::Chronos;
pub use correlation::CorrelationEngine;
pub use incidents::IncidentManager;
pub use nodecare::NodeCare;
