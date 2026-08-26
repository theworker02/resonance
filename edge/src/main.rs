//! Resonance Edge Node — VectorNode X1 runtime.
//!
//! Modes:
//! - `run` — production sensor daemon
//! - `simulate` — synthetic hardware mode
//! - `self-test` — hardware validation

mod config;

use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "resonance-edge", about = "Resonance VectorNode X1 edge runtime")]
struct Cli {
    #[arg(long, default_value = "node.toml")]
    config: String,
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Run,
    Simulate,
    SelfTest,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt().with_env_filter("info").init();
    let cli = Cli::parse();
    tracing::info!("Resonance Edge starting");

    match cli.command.unwrap_or(Commands::Run) {
        Commands::Run => { tracing::info!("Production mode"); Ok(()) }
        Commands::Simulate => { tracing::info!("Simulation mode"); Ok(()) }
        Commands::SelfTest => { tracing::info!("Self-test mode"); Ok(()) }
    }
}
