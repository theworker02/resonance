//! Resonance SDK — public signal processing library and detector interface.
//!
//! This crate provides:
//! - Acoustic feature extraction (MFCC, spectral, envelope)
//! - Direction-of-arrival estimation (VectorWave)
//! - Acoustic fingerprinting (WavePrint)
//! - Probability surface generation (APS)
//! - Conflict detection (ConflictGuard)
//! - Scene health assessment
//! - Detector development interface
//!
//! Third-party developers use this crate to build custom detector modules
//! without needing access to the full platform internals.

pub mod detector;
pub mod features;
pub mod signal;

pub use detector::DetectorInterface;
