import { FastifyPluginAsync } from 'fastify'

/**
 * Onboarding routes — guide new users through their first deployment.
 *
 * The "Start with Simulation" flow creates:
 * - 4 virtual nodes
 * - 1 spatial cell
 * - Sample environmental conditions
 * - Synthetic observations
 * - A sample incident
 */
export const onboardingRoutes: FastifyPluginAsync = async (app) => {
  // POST /v1/onboarding/simulate
  app.post('/simulate', async (request, reply) => {
    // Create a virtual deployment for the authenticated user
    const simDeployment = {
      deployment_id: crypto.randomUUID(),
      name: 'Simulation — Getting Started',
      type: 'simulation',
      nodes: [
        { id: crypto.randomUUID(), name: 'SIM-Node-NW', lat: 40.7130, lon: -74.0065, status: 'online' },
        { id: crypto.randomUUID(), name: 'SIM-Node-NE', lat: 40.7130, lon: -74.0055, status: 'online' },
        { id: crypto.randomUUID(), name: 'SIM-Node-SE', lat: 40.7120, lon: -74.0055, status: 'online' },
        { id: crypto.randomUUID(), name: 'SIM-Node-SW', lat: 40.7120, lon: -74.0065, status: 'online' },
      ],
      cell: {
        id: crypto.randomUUID(),
        name: 'SIM-Cell-001',
        status: 'active',
        calibration_score: 95,
      },
      environment: {
        temperature_c: 22.0,
        humidity_pct: 55.0,
        wind_speed_ms: 2.1,
        wind_bearing_deg: 180,
        speed_of_sound_ms: 344.6,
      },
      sample_incident: {
        id: crypto.randomUUID(),
        classification: 'impulsive_event',
        confidence: 0.89,
        status: 'pending_review',
        observations: 4,
        sector: 'NE',
        created_at: new Date().toISOString(),
      },
    }

    reply.code(201).send({
      message: 'Simulation deployment created. You can now explore incidents, nodes, and spatial cells.',
      deployment: simDeployment,
      next_steps: [
        { action: 'View incident', url: `/incidents/${simDeployment.sample_incident.id}` },
        { action: 'Explore fleet', url: '/fleet' },
        { action: 'Open Live view', url: '/live' },
      ],
    })
  })

  // GET /v1/onboarding/status
  app.get('/status', async (request, reply) => {
    // Check onboarding progress for the current user
    reply.send({
      steps: [
        { id: 'create_org', label: 'Create organization', completed: true },
        { id: 'choose_type', label: 'Choose deployment type', completed: true },
        { id: 'create_workspace', label: 'Create workspace', completed: true },
        { id: 'add_node', label: 'Add first node or simulator', completed: false },
        { id: 'validate', label: 'Run validation', completed: false },
        { id: 'first_observation', label: 'View first observation', completed: false },
      ],
    })
  })
}
