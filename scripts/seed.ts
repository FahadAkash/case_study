import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function seed() {
  console.log("Seeding initial data...");

  // 1. Topics
  const topics = [
    {
      id: "topic-game",
      slug: "game",
      name: "Game Development",
      description: "Real-time graphics, physics simulation, engine tooling, and gameplay architecture.",
      template: [
        { type: "rich_text", title: "Problem & Core Concept", content: "<p>Outline the core premise of the game, the creative vision, and the specific technical constraints.</p>" },
        { type: "rich_text", title: "Technical Challenges & Physics", content: "<p>Detail the mathematical, rendering, or physics hurdles overcome during production.</p>" },
        { type: "code", title: "Core Simulation Code", language: "csharp", code: "// Unity Burst/Job system implementation\n[BurstCompile]\npublic struct FlightDynamicsJob : IJobParallelFor {\n    public void Execute(int index) {\n        // Deterministic aerodynamics calculation\n    }\n}" },
        { type: "stats", title: "Performance Metrics", stats: [{ label: "Target Framerate", value: "120 FPS", detail: "Locked on high-end PC" }, { label: "Draw Calls", value: "< 250", detail: "GPU Instancing enabled" }, { label: "Physics Tick Rate", value: "60 Hz", detail: "Fixed timestep" }] },
        { type: "rich_text", title: "Results & Post-Mortem", content: "<p>Key takeaways and lessons learned during development and release.</p>" }
      ]
    },
    {
      id: "topic-arvr",
      slug: "ar-vr",
      name: "AR / VR & Spatial",
      description: "Spatial computing, hand tracking, immersive UX, and multi-user room synchronization.",
      template: [
        { type: "rich_text", title: "Spatial Interaction Model", content: "<p>Describe the input paradigms: eye gaze, micro-gestures, 6DoF controller feedback.</p>" },
        { type: "rich_text", title: "Network Synchronization & Latency", content: "<p>How positional audio, spatial mesh synchronization, and sub-20ms motion-to-photon latency were achieved.</p>" },
        { type: "stats", title: "Spatial KPIs", stats: [{ label: "Latency", value: "< 14 ms", detail: "Motion-to-photon" }, { label: "Multi-user Sync", value: "32 Users", detail: "Zero jitter room mesh" }] }
      ]
    },
    {
      id: "topic-backend",
      slug: "backend",
      name: "Backend & Systems",
      description: "Distributed architectures, low-latency APIs, event streaming, and cloud infrastructure.",
      template: [
        { type: "rich_text", title: "System Architecture & Objectives", content: "<p>High-level architectural overview, SLA requirements, and scaling bottlenecks.</p>" },
        { type: "architecture", title: "System Topology", diagram: "Clients -> Envoy Proxy -> Go Services (gRPC) -> Kafka -> ClickHouse / Redis" },
        { type: "rich_text", title: "Scale & Load Numbers", content: "<p>Throughput metrics, failover recovery times, and memory footprint.</p>" },
        { type: "stats", title: "System Benchmarks", stats: [{ label: "Peak Throughput", value: "2.4M req/s", detail: "99.9th percentile < 8ms" }, { label: "Infra Cost", value: "-45%", detail: "Optimized buffer pooling" }] },
        { type: "rich_text", title: "Tradeoffs & Lessons", content: "<p>Engineering tradeoffs accepted and failure mode mitigations.</p>" }
      ]
    },
    {
      id: "topic-ai",
      slug: "ai",
      name: "AI & Machine Learning",
      description: "LLM agent orchestration, local inference optimization, and synthetic asset generation.",
      template: [
        { type: "rich_text", title: "Model Architecture & Pipeline", content: "<p>Model fine-tuning, context pruning, and vector indexing strategy.</p>" },
        { type: "stats", title: "Inference Latency", stats: [{ label: "Time-to-first-token", value: "85 ms", detail: "vLLM with speculative decoding" }, { label: "Accuracy", value: "99.4%", detail: "Zero halluncination guardrails" }] }
      ]
    },
    {
      id: "topic-tools",
      slug: "tools",
      name: "Tools & Editor Plugins",
      description: "Developer tooling, CI/CD automation, asset pipeline analyzers, and workflow productivity.",
      template: [
        { type: "rich_text", title: "The Developer Bottleneck", content: "<p>What was slowing engineers down and the quantitative cost of the manual process.</p>" },
        { type: "rich_text", title: "Custom Editor Tooling Built", content: "<p>Architecture of the plugin, UI/UX workflow, and automated static validation.</p>" },
        { type: "stats", title: "Productivity Impact", stats: [{ label: "Build Time Saved", value: "4.5 hrs/wk", detail: "Per engineer on team" }, { label: "Adoption", value: "100%", detail: "Integrated into commit hooks" }] }
      ]
    },
    {
      id: "topic-fde",
      slug: "fde",
      name: "Forward Deployed Engineering",
      description: "Customer-facing enterprise systems integration, air-gapped deployments, custom ETL connectors, and production rollout.",
      template: [
        { type: "rich_text", title: "Enterprise Client Context & Requirements", content: "<p>Describe the client's internal ecosystem, legacy constraints, security compliance (SOC2/HIPAA/air-gapped), and delivery goals.</p>" },
        { type: "architecture", title: "Client VPC Integration Topology", diagram: `flowchart TD
    subgraph EnterpriseVPC ["Client Enterprise VPC / On-Prem"]
        ClientData["Legacy Data Warehouses / ERP"] --> IngestionWorker["Air-Gapped Ingestion Daemon"]
        IngestionWorker --> PrivateLink["AWS PrivateLink / VPN Tunnel"]
    end

    subgraph CorePlatform ["Core Engine VPC"]
        PrivateLink --> EnvoyGateway["Envoy Secure Gateway"]
        EnvoyGateway --> StreamEngine["Distributed Processing Appliance"]
        StreamEngine --> TenantDB[("Tenant Isolated DB (Postgres)")]
    end` },
        { type: "architecture", title: "Tenant Isolation & Audit Data Schema", diagram: `erDiagram
    TENANT_ACCOUNT ||--|{ DEPLOYED_APPLIANCE : provisions
    TENANT_ACCOUNT ||--|{ AUDIT_LOG : tracks
    DEPLOYED_APPLIANCE ||--o{ SYNC_SESSION : executes
    TENANT_ACCOUNT {
        string tenant_id PK
        string organization_name
        string security_tier
        string vpc_peering_id
    }
    DEPLOYED_APPLIANCE {
        string appliance_id PK
        string tenant_id FK
        string version
        string airgap_mode
    }
    AUDIT_LOG {
        uuid event_id PK
        timestamp event_time
        string actor_principal
        string action_type
    }` },
        { type: "stats", title: "Delivery & Rollout KPIs", stats: [
          { label: "Deployment Time", value: "9 Days", detail: "Down from 3 months" },
          { label: "Data Throughput", value: "50 TB/day", detail: "Zero data loss" },
          { label: "Compliance Pass", value: "100%", detail: "Air-gapped audit approved" }
        ] }
      ]
    },
    {
      id: "topic-cloud",
      slug: "cloud-infra",
      name: "Cloud Infrastructure",
      description: "Multi-region cloud architecture, Kubernetes orchestration, Infrastructure-as-Code (Terraform), zero-downtime migrations, and reliability engineering.",
      template: [
        { type: "rich_text", title: "Infrastructure Challenge & SLA Requirements", content: "<p>Outline the availability SLAs (99.99%+), traffic surges, disaster recovery RTO/RPO targets, and multi-region resilience needs.</p>" },
        { type: "architecture", title: "Multi-Region Cloud Mesh Topology", diagram: `flowchart TD
    GlobalDNS["Cloudflare Global Anycast DNS"] --> RegionEast["US-East Region (Primary)"]
    GlobalDNS --> RegionWest["US-West Region (Secondary Active)"]

    subgraph RegionEast ["AWS us-east-1 (Kubernetes Cluster)"]
        ALBEast["Application Load Balancer"] --> IngressEast["Cilium eBPF Service Mesh"]
        IngressEast --> MicroservicesEast["Containerized Workloads"]
        MicroservicesEast --> NeonEast[("Neon Postgres Serverless")]
    end

    subgraph RegionWest ["GCP us-west1 (Kubernetes Cluster)"]
        ALBWest["Google Cloud Load Balancer"] --> IngressWest["Cilium eBPF Service Mesh"]
        IngressWest --> MicroservicesWest["Containerized Workloads"]
        MicroservicesWest --> NeonWest[("Neon Postgres Read Replica")]
    end

    NeonEast <-.->|Sub-100ms Logical Replication| NeonWest` },
        { type: "architecture", title: "Multi-Region Consistency Schema", diagram: `erDiagram
    SERVICE_CLUSTER ||--|{ HEALTH_PROBE : monitors
    SERVICE_CLUSTER ||--|{ REGION_REPLICA : distributes
    SERVICE_CLUSTER {
        string cluster_id PK
        string region_name
        string cloud_provider
        string status
    }
    REGION_REPLICA {
        string replica_id PK
        string cluster_id FK
        int active_nodes
        int latency_p99_ms
    }
    HEALTH_PROBE {
        uuid probe_id PK
        timestamp checked_at
        boolean passes_slo
    }` },
        { type: "stats", title: "Cloud Platform Benchmarks", stats: [
          { label: "Uptime SLA", value: "99.995%", detail: "Zero unplanned outages" },
          { label: "Failover RTO", value: "< 45s", detail: "Automated DNS health route" },
          { label: "Infra Cost", value: "-38%", detail: "Kubernetes auto-scaler tuning" }
        ] }
      ]
    },
    {
      id: "topic-blank",
      slug: "blank",
      name: "Blank Custom",
      description: "A blank canvas to assemble any combination of blocks from scratch.",
      template: [
        { type: "rich_text", title: "Overview", content: "<p>Start writing your custom case study here...</p>" }
      ]
    }
  ];

  for (const t of topics) {
    await sql`
      INSERT INTO topics (id, slug, name, description, template)
      VALUES (${t.id}, ${t.slug}, ${t.name}, ${t.description}, ${JSON.stringify(t.template)}::jsonb)
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, template = EXCLUDED.template;
    `;
  }
  console.log("✓ Seeded topics");

  // 2. Case Studies
  const caseStudies = [
    {
      id: "cs-aetherfall",
      slug: "aetherfall-aerial-combat",
      title: "Aetherfall: High-Performance Flight Physics & Atmospheric Engine",
      outcome: "Delivered 120 FPS deterministic aerodynamics and custom volumetric cloud shading on PC & console.",
      summary: "A AAA-grade aerial combat simulator built in Unity with Burst Compiler, C# Job System, and compute shader atmospheric scattering. Overcame floating-point drift over 64km world maps.",
      topic_id: "topic-game",
      tags: ["Unity", "C#", "DOTS / Burst", "HLSL Compute", "Custom Physics"],
      role: "Lead Systems & Graphics Architect",
      duration: "14 months",
      year: "2024",
      stack: ["Unity 6", "C#", "HLSL", "DirectX 12", "FMOD Studio"],
      links: {
        demo: "https://example.com/aetherfall-demo",
        github: "https://github.com/example/aetherfall-physics",
        video: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview"
      },
      hero_media: {
        type: "image",
        drive_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
        drive_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
        fallback_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
        alt: "Aetherfall fighter aircraft cruising through procedural volumetric cloudscape"
      },
      featured: true,
      display_order: 1,
      status: "published",
      seo_title: "Aetherfall: Flight Physics & Volumetrics Case Study",
      seo_description: "Deep dive into 120 FPS deterministic aerodynamics, spatial partitioning, and volumetric rendering in Unity.",
      confidential_notice: "Proprietary aerodynamic coefficient lookup tables have been redacted under NDA.",
      blocks: [
        {
          type: "rich_text",
          title: "01 / The Challenge & Constraints",
          content: "<p>Modern flight simulators often sacrifice deterministic multiplayer synchronization for aerodynamic complexity. In <strong>Aetherfall</strong>, the requirement was uncompromised: simulate real-time lift, drag polar equations, and supersonic shockwave displacement for up to 32 players in a 64km³ volume—all while sustaining a rock-solid 120 FPS framerate with zero garbage collection allocations in the hot loop.</p><p>Standard Unity Rigidbody physics could not sustain 32 concurrent aerodynamic aircraft with multi-wing chord calculations without dropping below 45 FPS on base hardware.</p>"
        },
        {
          type: "stats",
          title: "Production Metrics & Constraints",
          stats: [
            { label: "Target Framerate", value: "120 FPS", detail: "Locked on 99.8% frames" },
            { label: "Hot-Loop Allocations", value: "0 B/frame", detail: "Pure unmanaged memory" },
            { label: "World Dimensions", value: "64 km³", detail: "Origin-shifting coordinates" },
            { label: "Multiplayer Tick Rate", value: "60 Hz", detail: "Deterministic client rollback" }
          ]
        },
        {
          type: "rich_text",
          title: "02 / Custom Aerodynamic Solver Architecture",
          content: "<p>We completely bypassed the default PhysX pipeline and built a native unmanaged aerodynamic solver utilizing the <strong>Unity Job System</strong> and <strong>Burst Compiler</strong>. Each aircraft is modeled as an interconnected tree of aerodynamic lifting surfaces (wings, canards, elevators, vertical stabilizers, and fuselage camber).</p><p>By transforming aerodynamic coefficients into SIMD-friendly vector structs (using <code>Unity.Mathematics.float4</code> and <code>float8</code>), the solver calculates Reynolds numbers, angle-of-attack induced drag, and ground effect cushions in under <strong>0.32 milliseconds</strong> per tick across all 32 aircraft combined.</p>"
        },
        {
          type: "architecture",
          title: "Simulation & Rollback Architecture",
          diagram: `flowchart TD
    subgraph ClientSimulation ["Client Simulation Frame (120 FPS)"]
        Input["Pilot Flight Stick Controls"] --> Kinematics["Aircraft Kinematics Buffer"]
        Kinematics --> LiftJob["LiftDragEvaluationJob (Burst Parallel)"]
        LiftJob --> Airfoil["Chord Aerodynamics & Induced Drag"]
        Airfoil --> Forces["Unmanaged Aerodynamic Forces"]
        Forces --> Integrator["Verlet Motion Integrator"]
    end

    subgraph ServerRollback ["Server Authority (60 Hz Rollback)"]
        RollbackState["Snapshot State Buffer"] --> ServerSim["Server Physics Tick"]
        ServerSim --> StateSync["Deterministic State Delta"]
    end

    Integrator --> RenderMesh["GPU Instanced Mesh Matrix"]
    StateSync -.->|Sub-15ms Sync| Kinematics`
        },
        {
          type: "architecture",
          title: "Entity Component & Memory Layout",
          diagram: `erDiagram
    AIRCRAFT_ENTITY ||--|{ WING_SURFACE : contains
    AIRCRAFT_ENTITY ||--|| KINEMATIC_STATE : tracks
    AIRCRAFT_ENTITY ||--o{ FORCE_OUTPUT : generates
    AIRCRAFT_ENTITY {
        int entity_id PK
        float mass_kg
        float3 center_of_mass
        float3 inertia_tensor
    }
    WING_SURFACE {
        int surface_id PK
        int aircraft_id FK
        float lift_slope
        float zero_lift_drag
        float aspect_ratio
        float3 chord_vector
    }
    KINEMATIC_STATE {
        float3 position
        quaternion rotation
        float3 linear_velocity
        float3 angular_velocity
    }
    FORCE_OUTPUT {
        float3 total_lift
        float3 total_drag
        float3 induced_torque
    }`
        },
        {
          type: "code",
          title: "Burst-Compiled Lifting Line Calculation",
          language: "csharp",
          code: `[BurstCompile(FloatMode = FloatMode.Fast, FloatPrecision = FloatPrecision.Standard, OptimizeFor = OptimizeFor.Performance)]
public struct LiftDragEvaluationJob : IJobParallelFor
{
    [ReadOnly] public NativeArray<WingSurfaceData> Surfaces;
    [ReadOnly] public NativeArray<AircraftKinematics> Kinematics;
    [WriteOnly] public NativeArray<AerodynamicForceOutput> Forces;

    public void Execute(int index)
    {
        var surface = Surfaces[index];
        var state = Kinematics[surface.AircraftIndex];
        
        // Relative airspeed in chord local space
        float3 localAirVelocity = state.Velocity - state.WindVector;
        float speedSq = math.lengthsq(localAirVelocity);
        if (speedSq < 0.001f) return;

        float dynamicPressure = 0.5f * state.AirDensity * speedSq;
        float alpha = math.atan2(-localAirVelocity.y, localAirVelocity.z); // Angle of Attack

        // Non-linear stall curve interpolation
        float cl = math.sin(2f * alpha) * surface.LiftSlopeFactor;
        float cd = surface.ZeroLiftDrag + (cl * cl) / (math.PI * surface.AspectRatio * surface.OswaldEfficiency);

        float3 liftDir = math.normalize(math.cross(math.cross(localAirVelocity, surface.SpanAxis), localAirVelocity));
        float3 dragDir = -math.normalize(localAirVelocity);

        Forces[index] = new AerodynamicForceOutput {
            ForceVector = (liftDir * cl + dragDir * cd) * dynamicPressure * surface.Area,
            ApplicationPoint = surface.CenterOfPressureWorld
        };
    }
}`
        },
        {
          type: "rich_text",
          title: "03 / Volumetric Raymarched Atmospheric Shading",
          content: "<p>To deliver visceral immersion without killing the GPU budget, we implemented a custom single-pass raymarching compute shader running at half-resolution with temporal reprojection. Optical depth is sampled through a 3D Perlin-Worley noise texture, with Henyey-Greenstein phase scattering providing blinding forward silver-lining highlights when banking towards the sun.</p>"
        },
        {
          type: "quote",
          quote: "The flight dynamics in Aetherfall feel razor sharp. You feel the bite of the air as you pull high-G turns above the cloud deck.",
          author: "Technical Director, Polygon Arcade"
        },
        {
          type: "rich_text",
          title: "04 / Hard Problems: Large-Scale Coordinate Drift",
          content: "<p>When navigating across a 64 kilometer boundary, 32-bit single-precision floating point numbers begin losing sub-millimeter precision, causing micro-jitter in camera position and cockpit instrument dials. We solved this with a hierarchical <strong>Floating Origin System</strong>: whenever the camera strays more than 2,000 meters from world (0,0,0), the entire scene graph performs a seamless world-space translation. Rigidbodies, particle origins, and physics colliders update in a single sync barrier with zero visible hitching.</p>"
        },
        {
          type: "rich_text",
          title: "05 / Key Takeaways & What I'd Do Differently",
          content: "<p>While the Burst-compiled physics solver yielded astonishing performance, developing custom spatial debugging visualizers early in the prototyping phase would have saved at least three weeks of tuning. For future projects, I would integrate continuous automated physics telemetry in CI to catch regression in aerodynamic lift curves before commits merge.</p>"
        }
      ]
    },
    {
      id: "cs-hyperion",
      slug: "hyperion-distributed-telemetry",
      title: "Hyperion: 2.4M Event/Sec Distributed Telemetry & Analytics Engine",
      outcome: "Architected high-throughput telemetry pipeline slashing query latency by 78% and infrastructure spend by 45%.",
      summary: "A global event ingestion platform built for live-service games, processing 2.4 million events per second across multi-region edge gateways into ClickHouse with automated partitioning.",
      topic_id: "topic-backend",
      tags: ["Go", "Kafka", "ClickHouse", "Kubernetes", "Redis", "Distributed Systems"],
      role: "Principal Infrastructure Architect",
      duration: "9 months",
      year: "2024",
      stack: ["Go 1.22", "Apache Kafka", "ClickHouse", "Redis Cluster", "Kubernetes", "Grafana"],
      links: {
        demo: "https://example.com/hyperion-dashboard",
        github: "https://github.com/example/hyperion-stream"
      },
      hero_media: {
        type: "image",
        drive_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
        drive_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
        fallback_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
        alt: "Hyperion real-time telemetry network topology and latency monitors"
      },
      featured: true,
      display_order: 2,
      status: "published",
      seo_title: "Hyperion: Distributed Telemetry Architecture Case Study",
      seo_description: "Scaling real-time game telemetry to 2.4M events/sec using Go, Kafka, and ClickHouse.",
      blocks: [
        {
          type: "rich_text",
          title: "01 / The Problem: Crushing Ingestion Spikes",
          content: "<p>During major global game season launches, concurrent player spikes generated over <strong>2,400,000 telemetry events every second</strong>. The legacy Elasticsearch and MongoDB cluster suffered from catastrophic write bottlenecks, resulting in backpressured ingestion queues, 45-minute analytics delay, and month-over-month cloud infrastructure bills exceeding \$80,000.</p>"
        },
        {
          type: "architecture",
          title: "Distributed Pipeline Topology",
          diagram: `flowchart LR
    subgraph IngressTier ["Edge Anycast Ingress"]
        Clients["Game Clients (PC/Mobile)"] --> VIP["Anycast Edge VIP"]
        VIP --> Envoy["Envoy Proxy (mTLS / HTTP/2)"]
    end

    subgraph StreamingCore ["High-Throughput Streaming"]
        Envoy --> Daemons["Go Ingestion Daemon (SIMD JSON)"]
        Daemons --> Batchers["Ring Buffer Batcher"]
        Batchers --> Kafka[("Apache Kafka (128 Partitions)")]
    end

    subgraph HybridStorage ["Analytical & Session Storage"]
        Kafka --> Workers["Go Stream Consumers"]
        Workers --> ClickHouse[("ClickHouse (ReplicatedMergeTree)")]
        Workers --> Redis[("Redis Cluster (Session Hot Cache)")]
        Workers --> NeonDB[("Neon Postgres (Metadata & Auth)")]
    end

    subgraph Observability ["Telemetry Visualizer"]
        ClickHouse --> Dashboards["Grafana Real-time BI"]
        ClickHouse --> Alerts["Automated SLO Anomaly Alerts"]
    end`
        },
        {
          type: "architecture",
          title: "ClickHouse & Postgres Schema Architecture",
          diagram: `erDiagram
    PLAYER_SESSION ||--|{ TELEMETRY_EVENT : emits
    TELEMETRY_EVENT ||--o{ WEAPON_STAT : records
    TELEMETRY_EVENT ||--o{ SPATIAL_COORD : maps
    PLAYER_SESSION {
        uuid session_id PK
        string player_id
        string platform
        string region
        timestamp started_at
    }
    TELEMETRY_EVENT {
        uuid event_id PK
        uuid session_id FK
        timestamp event_time
        string event_type
        int p99_latency_ms
        int fps
    }
    WEAPON_STAT {
        string weapon_id
        int damage_dealt
        boolean hit_confirmed
    }
    SPATIAL_COORD {
        float3 position
        int sector_id
    }`
        },
        {
          type: "stats",
          title: "Performance Transformation",
          stats: [
            { label: "Sustained Peak", value: "2.4M ev/s", detail: "Zero dropped frames" },
            { label: "P99 Ingestion Latency", value: "3.2 ms", detail: "Edge to Kafka broker" },
            { label: "Query Speedup", value: "78% Faster", detail: "Aggregate scans < 400ms" },
            { label: "Monthly Infra Cost", value: "-45%", detail: "Optimized compaction" }
          ]
        },
        {
          type: "code",
          title: "High-Throughput Ring Buffer Dispatcher in Go",
          language: "go",
          code: `package ingestion

import (
	"sync/atomic"
	"time"
)

type EventBatcher struct {
	bufSize   int
	flushRate time.Duration
	queue     chan TelemetryPayload
	dropped   uint64
}

func (eb *EventBatcher) IngestNonBlocking(event TelemetryPayload) bool {
	select {
	case eb.queue <- event:
		return true
	default:
		// Atomic telemetry dropped counter for monitoring under backpressure
		atomic.AddUint64(&eb.dropped, 1)
		return false
	}
}

func (eb *EventBatcher) FlushWorker(flusher func([]TelemetryPayload) error) {
	batch := make([]TelemetryPayload, 0, eb.bufSize)
	ticker := time.NewTicker(eb.flushRate)
	defer ticker.Stop()

	for {
		select {
		case ev := <-eb.queue:
			batch = append(batch, ev)
			if len(batch) >= eb.bufSize {
				_ = flusher(batch)
				batch = batch[:0]
			}
		case <-ticker.C:
			if len(batch) > 0 {
				_ = flusher(batch)
				batch = batch[:0]
			}
		}
	}
}`
        },
        {
          type: "rich_text",
          title: "02 / Why ClickHouse Replaced Document Stores",
          content: "<p>By structuring telemetry as columnar rows with LZ4 block compression, disk usage collapsed from 14 Terabytes to <strong>1.8 Terabytes</strong> for the same 90-day retention window. Analytical aggregations (e.g. median player kill-death ratio by weapon type and map quadrant) that previously took 4 minutes now execute in <strong>180 milliseconds</strong>.</p>"
        }
      ]
    },
    {
      id: "cs-spatialforge",
      slug: "spatialforge-cad-visionos",
      title: "SpatialForge: Real-Time Collaborative Spatial CAD for Apple Vision Pro",
      outcome: "Enabled sub-15ms collaborative manipulation of 2M+ triangle mechanical assemblies in shared spatial rooms.",
      summary: "A spatial computing workspace built with Unity PolySpatial, RealityKit, and custom WebRTC data channels allowing engineering teams to dissect CAD models in true physical scale.",
      topic_id: "topic-arvr",
      tags: ["visionOS", "Unity PolySpatial", "C#", "RealityKit", "WebRTC", "Spatial Computing"],
      role: "Spatial UX & Systems Engineer",
      duration: "8 months",
      year: "2024",
      stack: ["Apple Vision Pro", "Unity 6 PolySpatial", "Swift", "WebRTC", "Photon Fusion"],
      links: {
        demo: "https://example.com/spatialforge",
        video: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview"
      },
      hero_media: {
        type: "image",
        drive_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
        drive_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
        fallback_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
        alt: "SpatialForge collaborative CAD model floating in living room environment"
      },
      featured: true,
      display_order: 3,
      status: "published",
      seo_title: "SpatialForge: visionOS Collaborative CAD Case Study",
      seo_description: "Real-time collaborative CAD exploration on Apple Vision Pro with Unity PolySpatial and WebRTC.",
      blocks: [
        {
          type: "rich_text",
          title: "01 / Transforming CAD from Flat Monitors to Mixed Reality",
          content: "<p>Automotive and aerospace mechanical assemblies contain millions of parametric polygons. Traditional viewing tools flatten these 3D geometries onto 2D monitors, losing spatial intuition. SpatialForge allows 8 distributed engineers to stand around an engine assembly projected into their shared physical space, grab components with eye-gaze and finger pinches, and perform real-time cross-section measurements.</p>"
        },
        {
          type: "stats",
          title: "Spatial Performance Indicators",
          stats: [
            { label: "Motion-To-Photon", value: "< 12 ms", detail: "Maintained 90 Hz display" },
            { label: "Mesh Capacity", value: "2,400,000", detail: "Triangles rendered smoothly" },
            { label: "Sync Jitter", value: "< 8 ms", detail: "WebRTC peer data channels" }
          ]
        },
        {
          type: "architecture",
          title: "Multi-User Spatial Synchronization Pipeline",
          diagram: `flowchart TD
    subgraph SpatialClients ["Spatial Clients"]
        AVP["Apple Vision Pro (visionOS 2)"]
        Quest["Meta Quest 3 (OpenXR)"]
    end

    subgraph PeerSync ["Low-Latency Sync Engine"]
        AVP <-->|WebRTC DataChannel (<12ms)| PhotonFusion["Photon Fusion Multi-Peer Relay"]
        Quest <-->|WebRTC DataChannel| PhotonFusion
        PhotonFusion --> SpatialAnchor["Spatial Anchor Coordinate Reconciler"]
    end

    subgraph AssemblyStorage ["CAD Engine Backend"]
        SpatialAnchor --> MeshServer["USDZ / gITF Mesh Streamer"]
        MeshServer --> CloudCAD[("Neon Postgres (CAD Assembly Trees)")]
    end`
        }
      ]
    },
    {
      id: "cs-assetvanguard",
      slug: "assetvanguard-unity-auditor",
      title: "AssetVanguard: Automated Unity Memory Profiler & Asset Audit Suite",
      outcome: "Automated texture compression, duplicate mesh detection, and bundle budget enforcement across 40+ engineering teams.",
      summary: "A developer productivity suite and custom Unity Editor extension that intercepts asset imports, analyzes memory overhead, and enforces build budgets directly inside Git hooks and CI pipelines.",
      topic_id: "topic-tools",
      tags: ["Unity Editor", "C#", "Roslyn Analyzers", "CI/CD", "DevTools"],
      role: "Lead Developer Tools Engineer",
      duration: "5 months",
      year: "2023",
      stack: ["Unity Editor API", "C#", "SQLite", "GitHub Actions", "IMGUI"],
      links: {
        github: "https://github.com/example/asset-vanguard"
      },
      hero_media: {
        type: "image",
        drive_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
        drive_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
        fallback_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
        alt: "AssetVanguard editor inspector analyzing texture mipmap and memory allocations"
      },
      featured: true,
      display_order: 4,
      status: "published",
      seo_title: "AssetVanguard: Unity Memory Profiler Case Study",
      seo_description: "How AssetVanguard saved 4.5 hours per engineer per week and eliminated out-of-memory crashes on mobile targets.",
      blocks: [
        {
          type: "rich_text",
          title: "01 / The Cost of Unchecked Asset Bloat",
          content: "<p>In multi-disciplinary studios with hundreds of artists and engineers, uncompressed 4K textures, unreferenced audio clips, and duplicated mesh assets silently balloon mobile build sizes and trigger Out-Of-Memory (OOM) crashes on low-end devices. AssetVanguard was built as a zero-friction gatekeeper.</p>"
        },
        {
          type: "stats",
          title: "Developer Efficiency Gains",
          stats: [
            { label: "Time Saved", value: "4.5 hr/wk", detail: "Per engineer on team" },
            { label: "Build Size", value: "-34%", detail: "From 1.8GB down to 1.1GB" },
            { label: "OOM Crash Rate", value: "-89%", detail: "On 2GB RAM test devices" }
          ]
        }
      ]
    },
    {
      id: "cs-vanguard",
      slug: "vanguard-enterprise-fde-rollout",
      title: "Vanguard: Enterprise On-Premises Core Platform Rollout",
      outcome: "Led high-stakes customer-site deployment of a real-time data engine in air-gapped financial VPCs, cutting client integration time from 3 months to 9 days.",
      summary: "As Lead Forward Deployed Engineer (FDE), architected the custom ingestion adapters, automated air-gapped Helm deployments, and zero-trust audit verification for a Tier-1 financial institution.",
      topic_id: "topic-fde",
      tags: ["Forward Deployed", "FDE", "Go", "Kubernetes", "Air-Gapped", "Terraform", "Kafka"],
      role: "Lead Forward Deployed Engineer (FDE)",
      duration: "7 months",
      year: "2024",
      stack: ["Go 1.22", "Kubernetes", "Helm", "AWS PrivateLink", "Kafka", "Postgres", "Docker"],
      links: {
        demo: "https://example.com/vanguard-docs",
        github: "https://github.com/example/vanguard-adapter"
      },
      hero_media: {
        type: "image",
        drive_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
        drive_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
        fallback_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        alt: "Vanguard enterprise customer architecture topology and deployment status monitor"
      },
      featured: true,
      display_order: 5,
      status: "published",
      seo_title: "Vanguard: Forward Deployed Engineering Case Study",
      seo_description: "How FDE execution delivered sub-10 day enterprise on-premises air-gapped rollout with zero data loss.",
      confidential_notice: "Client corporate identifiers and proprietary data schemas have been anonymized under enterprise NDA.",
      blocks: [
        {
          type: "rich_text",
          title: "01 / The FDE Mission & Enterprise Friction",
          content: "<p>The core platform offered world-class real-time analytics, but sales cycles stalled because enterprise financial clients refused multi-tenant SaaS. They required an <strong>on-premises, air-gapped installation</strong> inside their private AWS GovCloud and on-prem OpenShift clusters, with strict requirement for zero outbound internet connectivity and SOC2 Type II compliance.</p><p>As the Forward Deployed Engineer, my mandate was to sit embedded with the client's internal security and infrastructure teams, diagnose their legacy data pipeline formats, and engineer custom zero-trust connectors.</p>"
        },
        {
          type: "architecture",
          title: "Enterprise VPC Integration Topology",
          diagram: `flowchart TD
    subgraph ClientOnPrem ["Client Private VPC / Air-Gapped Network"]
        LegacyDB["Client Core Banking DB (Oracle / DB2)"] --> ETLDaemon["Custom Go FDE Ingestion Daemon"]
        ETLDaemon --> LocalBuffer["Encrypted On-Disk Ring Buffer"]
        LocalBuffer --> PrivateLink["AWS PrivateLink / VPC Endpoint"]
    end

    subgraph SecureAppliance ["Isolated Tenant Appliance (Air-Gapped)"]
        PrivateLink --> Envoy["Envoy Proxy (mTLS + Token Auth)"]
        Envoy --> StreamEngine["Platform Processing Core (Go Workflows)"]
        StreamEngine --> TenantDB[("Neon Postgres / Isolated Storage")]
    end

    subgraph ClientAudit ["Compliance & Security"]
        StreamEngine --> AuditLog["Tamper-Proof Audit Logger"]
        AuditLog --> Splunk["Client Enterprise Splunk / SIEM"]
    end`
        },
        {
          type: "architecture",
          title: "Tenant Isolation & RBAC Security Schema",
          diagram: `erDiagram
    TENANT_ACCOUNT ||--|{ DEPLOYED_APPLIANCE : provisions
    TENANT_ACCOUNT ||--|{ AUDIT_LOG : tracks
    DEPLOYED_APPLIANCE ||--o{ SYNC_SESSION : executes
    TENANT_ACCOUNT {
        string tenant_id PK
        string org_name
        string security_tier
        string vpc_peering_id
    }
    DEPLOYED_APPLIANCE {
        string appliance_id PK
        string tenant_id FK
        string version
        boolean is_airgap
    }
    AUDIT_LOG {
        uuid log_id PK
        timestamp event_time
        string actor_identity
        string action_type
        int records_synced
    }`
        },
        {
          type: "stats",
          title: "FDE Delivery KPIs",
          stats: [
            { label: "Deployment Velocity", value: "9 Days", detail: "Down from 90 days previously" },
            { label: "Daily Throughput", value: "50 TB/day", detail: "Zero dropped records" },
            { label: "Security Audit", value: "100% Pass", detail: "Zero air-gap escape vulnerabilities" },
            { label: "Contract Expansion", value: "\$2.4M ARR", detail: "Client signed 3-year extension" }
          ]
        },
        {
          type: "code",
          title: "Air-Gapped Resilient Ingestion Worker in Go",
          language: "go",
          code: `package fde

import (
	"context"
	"crypto/tls"
	"time"
)

type AirgapIngestor struct {
	clientVpcEndpoint string
	tlsConfig         *tls.Config
	diskBuffer        *DiskSpooler
}

func (ai *AirgapIngestor) StreamWithLocalBackpressure(ctx context.Context, records <-chan []byte) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case record := <-records:
			// If upstream link is severed, spool deterministically to encrypted disk
			if err := ai.transmitOrSpool(record); err != nil {
				ai.diskBuffer.Write(record)
			}
		}
	}
}`
        }
      ]
    },
    {
      id: "cs-stratus",
      slug: "stratus-multiregion-cloud-infra",
      title: "Stratus: Multi-Region Active-Active Cloud Mesh & Disaster Recovery",
      outcome: "Engineered multi-region active-active cloud infrastructure across AWS and GCP with 99.995% uptime and sub-minute disaster recovery failover.",
      summary: "Architected a dual-cloud multi-region Kubernetes platform with Cilium eBPF mesh, automated Terraform provisioning, and zero-RPO data replication across continental fault domains.",
      topic_id: "topic-cloud",
      tags: ["Cloud Infra", "Kubernetes", "AWS", "GCP", "Terraform", "eBPF", "Neon Postgres", "SRE"],
      role: "Principal Cloud Platform Architect",
      duration: "11 months",
      year: "2024",
      stack: ["AWS", "Google Cloud", "Kubernetes", "Terraform", "Cilium eBPF", "Envoy", "Neon Postgres", "ArgoCD"],
      links: {
        demo: "https://example.com/stratus-status",
        github: "https://github.com/example/stratus-iac"
      },
      hero_media: {
        type: "image",
        drive_id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
        drive_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
        fallback_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
        alt: "Stratus global multi-region cloud mesh topology and active health telemetry"
      },
      featured: true,
      display_order: 6,
      status: "published",
      seo_title: "Stratus: Multi-Region Cloud Infrastructure Case Study",
      seo_description: "Active-active multi-cloud Kubernetes deployment with sub-minute automated failover and 99.995% uptime.",
      blocks: [
        {
          type: "rich_text",
          title: "01 / The Challenge: Single-Cloud Outage Vulnerability",
          content: "<p>A catastrophic 6-hour AWS us-east-1 regional outage had previously cost the business over \$420,000 in unrecoverable revenue. The architectural imperative was unequivocal: design an <strong>Active-Active Multi-Cloud Mesh</strong> capable of dynamically rerouting 100% of global traffic between AWS and Google Cloud within 45 seconds with zero operator intervention.</p>"
        },
        {
          type: "architecture",
          title: "Multi-Region Cloud Mesh Architecture",
          diagram: `flowchart TD
    GlobalDNS["Cloudflare Global Anycast DNS (BGP Health Checks)"] --> RegionEast["AWS us-east-1 (Primary Active)"]
    GlobalDNS --> RegionWest["GCP us-west1 (Secondary Active)"]

    subgraph RegionEast ["AWS Region (us-east-1)"]
        ALBEast["AWS ALB Ingress"] --> MeshEast["Cilium eBPF Service Mesh"]
        MeshEast --> KubeEast["EKS Workload Nodes"]
        KubeEast --> NeonEast[("Neon Serverless Postgres")]
    end

    subgraph RegionWest ["GCP Region (us-west1)"]
        ALBWest["GCP HTTPS Load Balancer"] --> MeshWest["Cilium eBPF Service Mesh"]
        MeshWest --> KubeWest["GKE Workload Nodes"]
        KubeWest --> NeonWest[("Neon Read / Write Replicas")]
    end

    NeonEast <-.->|Sub-80ms Logical Sync| NeonWest
    MeshEast <-->|Inter-Cloud WireGuard Tunnel| MeshWest`
        },
        {
          type: "architecture",
          title: "Multi-Region Replication & Failover Schema",
          diagram: `erDiagram
    CLOUD_REGION ||--|{ KUBE_CLUSTER : hosts
    KUBE_CLUSTER ||--|{ SERVICE_NODE : orchestrates
    CLOUD_REGION ||--o{ HEALTH_TELEMETRY : samples
    CLOUD_REGION {
        string region_id PK
        string provider_name
        string geographic_zone
        string status
    }
    KUBE_CLUSTER {
        string cluster_id PK
        string region_id FK
        int node_count
        string k8s_version
    }
    HEALTH_TELEMETRY {
        uuid probe_id PK
        timestamp sampled_at
        int latency_p99_ms
        float packet_loss_pct
        boolean route_healthy
    }`
        },
        {
          type: "stats",
          title: "Reliability & FinOps Benchmarks",
          stats: [
            { label: "Measured Uptime", value: "99.995%", detail: "Zero unplanned customer downtime" },
            { label: "Automated Failover", value: "< 38s", detail: "Health-triggered DNS rerouting" },
            { label: "Infra Cost", value: "-38%", detail: "Spot instance auto-provisioning" },
            { label: "Deploy Cadence", value: "35 / day", detail: "ArgoCD GitOps continuous delivery" }
          ]
        }
      ]
    }
  ];

  for (const cs of caseStudies) {
    await sql`
      INSERT INTO case_studies (
        id, slug, title, outcome, summary, topic_id, tags, role, duration, year,
        stack, links, hero_media, blocks, featured, display_order, status,
        seo_title, seo_description, confidential_notice, published_at
      ) VALUES (
        ${cs.id}, ${cs.slug}, ${cs.title}, ${cs.outcome}, ${cs.summary}, ${cs.topic_id},
        ${JSON.stringify(cs.tags)}::jsonb, ${cs.role}, ${cs.duration}, ${cs.year},
        ${JSON.stringify(cs.stack)}::jsonb, ${JSON.stringify(cs.links)}::jsonb,
        ${JSON.stringify(cs.hero_media)}::jsonb, ${JSON.stringify(cs.blocks)}::jsonb,
        ${cs.featured}, ${cs.display_order}, ${cs.status},
        ${cs.seo_title}, ${cs.seo_description}, ${cs.confidential_notice || null}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        outcome = EXCLUDED.outcome,
        summary = EXCLUDED.summary,
        topic_id = EXCLUDED.topic_id,
        tags = EXCLUDED.tags,
        role = EXCLUDED.role,
        duration = EXCLUDED.duration,
        year = EXCLUDED.year,
        stack = EXCLUDED.stack,
        links = EXCLUDED.links,
        hero_media = EXCLUDED.hero_media,
        blocks = EXCLUDED.blocks,
        featured = EXCLUDED.featured,
        display_order = EXCLUDED.display_order,
        status = EXCLUDED.status,
        updated_at = NOW();
    `;
  }
  console.log("✓ Seeded case studies");

  // 3. Site Settings
  const defaultSettings = [
    { key: "hero_headline", value: "Engineering immersive game engines, spatial systems & distributed scale." },
    { key: "hero_intro", value: "Bridging low-level systems engineering with obsessive interactive polish. 8+ years building AAA graphics pipelines, spatial computing platforms, and distributed systems handling millions of events." },
    { key: "about_story", value: "I began my journey disassembling graphics shaders and network protocols in C++, later scaling into full engine architecture and high-throughput backend infrastructure.\n\nMy philosophy: performance is never an afterthought—it is the foundational prerequisite for true user delight. Every millisecond shaved and every byte aligned directly elevates the creative experience." },
    { key: "contact_email", value: "fahad@northfold-portfolio.dev" },
    { key: "cv_url", value: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing" },
    { key: "social_github", value: "https://github.com" },
    { key: "social_linkedin", value: "https://linkedin.com" },
    { key: "social_twitter", value: "https://x.com" },
    { key: "skills_list", value: ["C# / Unity DOTS & Burst", "C++ / HLSL Graphics", "Go / Distributed Systems", "TypeScript / Next.js", "visionOS / OpenXR", "Postgres / ClickHouse / Kafka", "Docker / Kubernetes"] }
  ];

  for (const s of defaultSettings) {
    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${s.key}, ${JSON.stringify(s.value)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `;
  }
  console.log("✓ Seeded site settings");

  // 4. FAQ
  const faqs = [
    {
      id: "faq-1",
      question: "What types of projects do you typically take on?",
      answer: "I specialize in high-performance technical challenges: real-time 3D and graphics simulation (Unity, C#, HLSL), spatial computing (visionOS, OpenXR), distributed backend architecture (Go, Kafka, ClickHouse), and developer tooling. If it requires uncompromising framerates or massive scale, I can help.",
      group_name: "Engagements",
      display_order: 1
    },
    {
      id: "faq-2",
      question: "How do you handle client confidentiality and NDAs?",
      answer: "I respect client IP with rigorous discretion. All proprietary data, client brand names, and sensitive architectural keys can be fully redacted or generalized into anonymized case studies. Clean boundaries and secure local workflows are guaranteed.",
      group_name: "Engagements",
      display_order: 2
    },
    {
      id: "faq-3",
      question: "Can you lead full technical architecture or do you only write code?",
      answer: "Both. I frequently lead the end-to-end technical roadmap from whiteboard topology and RFC design down to the critical hot-loop SIMD code. I also mentor engineering teams and conduct architectural audits.",
      group_name: "Capabilities",
      display_order: 3
    },
    {
      id: "faq-4",
      question: "What is your availability for contract or consulting roles?",
      answer: "I am available for select high-impact advisory, fractional technical lead roles, and full-lifecycle contract builds. Use the contact form to share your timeline and requirements.",
      group_name: "Availability",
      display_order: 4
    }
  ];

  for (const f of faqs) {
    await sql`
      INSERT INTO faq (id, question, answer, group_name, display_order)
      VALUES (${f.id}, ${f.question}, ${f.answer}, ${f.group_name}, ${f.display_order})
      ON CONFLICT (id) DO UPDATE SET
        question = EXCLUDED.question,
        answer = EXCLUDED.answer,
        group_name = EXCLUDED.group_name,
        display_order = EXCLUDED.display_order;
    `;
  }
  console.log("✓ Seeded FAQs");

  console.log("🎉 Database seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
