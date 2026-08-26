"""Resonance Simulator — MeshLab virtual acoustic mesh deployment.

Usage:
    python -m simulator --nodes 25 --environment suburban --duration 15m

Creates a grid of synthetic sensor nodes, simulates acoustic event propagation
through the mesh, and outputs correlated incidents.
"""

import argparse
import math
import random
import sys
import time
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class SimNode:
    node_id: str
    lat: float
    lon: float
    is_online: bool = True
    health_score: float = 100.0
    clock_offset_us: float = 0.0


@dataclass
class SimObservation:
    node_id: str
    event_id: str
    arrival_time_s: float
    received_db: float


@dataclass
class SimIncident:
    incident_id: str
    event_id: str
    observations: list
    confidence: float
    estimated_lat: float
    estimated_lon: float


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in metres."""
    R = 6_371_000
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def create_grid(rows: int, cols: int, spacing_m: float, origin_lat: float, origin_lon: float) -> list[SimNode]:
    """Deploy a grid of simulated nodes."""
    nodes = []
    m_per_deg_lat = 111_320
    m_per_deg_lon = 111_320 * math.cos(math.radians(origin_lat))

    for r in range(rows):
        for c in range(cols):
            lat = origin_lat + (r * spacing_m) / m_per_deg_lat
            lon = origin_lon + (c * spacing_m) / m_per_deg_lon
            node = SimNode(
                node_id=f"SIM-{r:02d}{c:02d}",
                lat=lat,
                lon=lon,
                clock_offset_us=random.gauss(0, 5),
            )
            nodes.append(node)
    return nodes


def simulate_event(nodes: list[SimNode], source_lat: float, source_lon: float, peak_db: float, event_id: str, speed_of_sound: float = 343.0) -> list[SimObservation]:
    """Simulate one acoustic event propagating to all nodes."""
    observations = []
    for node in nodes:
        if not node.is_online:
            continue
        dist = haversine_m(source_lat, source_lon, node.lat, node.lon)
        received_db = peak_db - 20 * math.log10(max(dist, 1.0))
        if received_db < 55.0:  # below detection threshold
            continue
        arrival_s = dist / speed_of_sound
        observations.append(SimObservation(
            node_id=node.node_id,
            event_id=event_id,
            arrival_time_s=arrival_s + node.clock_offset_us * 1e-6,
            received_db=received_db,
        ))
    return observations


def correlate(observations: list[SimObservation]) -> Optional[SimIncident]:
    """Simple correlation — require ≥ 2 sensors."""
    if len(observations) < 2:
        return None
    n = len(observations)
    confidence = min(0.95, 0.50 + n * 0.12)
    # Energy-weighted centroid (placeholder — real impl uses APS)
    total_e = sum(10 ** (o.received_db / 10) for o in observations)
    est_lat = 0.0
    est_lon = 0.0
    # Note: we'd need node positions here; simplified for now
    return SimIncident(
        incident_id=f"INC-SIM-{random.randint(1000,9999)}",
        event_id=observations[0].event_id,
        observations=observations,
        confidence=confidence,
        estimated_lat=est_lat,
        estimated_lon=est_lon,
    )


def parse_duration(s: str) -> float:
    """Parse '15m', '1h', '30s' to seconds."""
    s = s.strip().lower()
    if s.endswith("h"):
        return float(s[:-1]) * 3600
    if s.endswith("m"):
        return float(s[:-1]) * 60
    if s.endswith("s"):
        return float(s[:-1])
    return float(s)


def main():
    parser = argparse.ArgumentParser(description="Resonance Simulator")
    parser.add_argument("--nodes", type=int, default=25, help="Number of nodes")
    parser.add_argument("--environment", choices=["suburban", "urban", "rural", "industrial"], default="suburban")
    parser.add_argument("--duration", default="15m", help="Simulation duration (e.g. 15m, 1h)")
    parser.add_argument("--cell-size", type=float, default=150.0, help="Node spacing (metres)")
    args = parser.parse_args()

    side = int(math.ceil(math.sqrt(args.nodes)))
    duration_s = parse_duration(args.duration)

    print(f"\n  Resonance Simulator")
    print(f"  Nodes: {side}x{side} = {side*side}")
    print(f"  Environment: {args.environment}")
    print(f"  Duration: {args.duration}\n")

    nodes = create_grid(side, side, args.cell_size, 40.7128, -74.006)
    print(f"  Deployed {len(nodes)} nodes.\n")

    events = 0
    incidents = 0
    sim_time = 0.0

    while sim_time < duration_s:
        interval = random.expovariate(1.0 / 50.0)
        sim_time += interval
        if sim_time > duration_s:
            break

        events += 1
        lat = random.uniform(nodes[0].lat, nodes[-1].lat)
        lon = random.uniform(nodes[0].lon, nodes[-1].lon)
        peak = random.uniform(75, 120)
        eid = f"EVT-{events:04d}"

        obs = simulate_event(nodes, lat, lon, peak, eid)
        inc = correlate(obs)
        if inc:
            incidents += 1
            print(f"  {sim_time:7.1f}s  {eid}  {len(obs)} sensors  -> INC  conf={inc.confidence:.2f}")
        elif obs:
            print(f"  {sim_time:7.1f}s  {eid}  {len(obs)} sensor(s)  unverified")

    print(f"\n  Complete.")
    print(f"  Events: {events}")
    print(f"  Incidents: {incidents}")
    print(f"  Unverified: {events - incidents}\n")


if __name__ == "__main__":
    main()
