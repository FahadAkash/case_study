import { CaseStudy, Topic, FaqItem } from "./db";

export const FALLBACK_TOPICS: Topic[] = [
  {
    id: "topic-ai",
    slug: "ai",
    name: "AI & Machine Learning",
    description: "Enterprise hybrid RAG, multi-agent LangGraph orchestration, biometric computer vision, and local inference optimization.",
    template: [],
  },
  {
    id: "topic-arvr",
    slug: "ar-vr",
    name: "AR / VR & Spatial",
    description: "Immersive VR forensic simulations, military tactical training, procedural scene generation, and spatial synchronization.",
    template: [],
  },
  {
    id: "topic-cloud",
    slug: "cloud-infra",
    name: "Cloud Infrastructure",
    description: "Distributed AWS ECS/GKE container orchestration, S3/CloudFront asset streaming, edge acceleration, and auto-scaling.",
    template: [],
  },
  {
    id: "topic-fde",
    slug: "fde",
    name: "Forward Deployed Engineering",
    description: "Customer-facing enterprise systems integration, air-gapped deployments, custom ETL connectors, and production rollout.",
    template: [],
  },
  {
    id: "topic-backend",
    slug: "backend",
    name: "Backend & Systems",
    description: "Zero-CGO Go services, CQRS MediatR architecture, Redis pub/sub backplanes, and low-latency transactional engines.",
    template: [],
  },
  {
    id: "topic-game",
    slug: "game",
    name: "Game Development",
    description: "Real-time graphics, physics simulation, engine tooling, and deterministic gameplay architecture.",
    template: [],
  },
  {
    id: "topic-tools",
    slug: "tools",
    name: "Tools & Editor Plugins",
    description: "Developer tooling, CI/CD automation, asset pipeline analyzers, and workflow productivity.",
    template: [],
  },
];

export const FALLBACK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-giz-emergency",
    slug: "giz-emergency-response-training",
    title: "GIZ Emergency Response Training Platform: Cloud-Streamed Real-Time Evacuation Simulation",
    outcome: "Slashed initial load time by 70%, eliminated client redeployment for scenario updates, and trained 12,000+ garment workers across distributed facilities.",
    summary: "Architected a centralized industrial evacuation and fire-safety training platform for GIZ to educate garment factory workforces across distributed manufacturing hubs in Bangladesh. Built with ASP.NET Core 7, AWS ECS/Fargate, AWS S3/CloudFront digital asset streaming, SignalR live telemetry, PostgreSQL, Redis, and interactive Unity 3D client simulations.",
    topic_id: "topic-cloud",
    topic_name: "Cloud Infrastructure",
    topic_slug: "cloud-infra",
    tags: ["ASP.NET Core 7", "AWS ECS", "AWS Lambda", "AWS S3 / CloudFront", "SignalR", "PostgreSQL", "Redis", "Unity", "Industrial Safety"],
    role: "Lead Full-Stack & Cloud Infrastructure Architect",
    duration: "9 months",
    year: "2024",
    stack: ["ASP.NET Core 7", "AWS ECS (Fargate)", "AWS CloudFront", "Amazon S3", "AWS Lambda", "SignalR", "PostgreSQL", "Redis", "Unity 3D / WebGL", "Docker"],
    links: {
      demo: "https://giz-training.example.com",
      github: "https://github.com/example/giz-emergency-response",
    },
    hero_media: {
      type: "image",
      fallback_url: "/thumbnails/giz-training.jpg",
      alt: "GIZ Emergency Response Training Platform 3D factory simulation with evacuation heatmaps and HUD telemetry",
    },
    featured: true,
    display_order: 1,
    status: "published",
    blocks: [
      {
        type: "rich_text",
        title: "01 / The Operational Problem & Distributed Manufacturing Bottleneck",
        content: `
          <p>In Bangladesh's readymade garment (RMG) sector, industrial fire safety and rapid facility evacuation training are mandatory compliance requirements that directly save lives. However, physical evacuation drills across dozens of distributed factories in Gazipur, Narayanganj, and Chittagong introduced severe operational friction:</p>
          <ul>
            <li><strong>Catastrophic Production Stoppage:</strong> Halting active factory floors for physical drills caused hundreds of lost operational hours per facility.</li>
            <li><strong>Poor Spatial Muscle Memory:</strong> Traditional classroom slide presentations and printed pamphlets resulted in near-zero retention during simulated smoke conditions or blocked fire exits.</li>
            <li><strong>Deployment Nightmare across Low-Bandwidth Labs:</strong> Initial 3D simulation prototypes weighed over 850MB. Factory computer rooms frequently suffered from intermittent &lt; 5 Mbps network links, and whenever safety officers updated an evacuation protocol or room hazard layout, IT technicians had to physically re-flash hundreds of client PCs.</li>
          </ul>
          <p>GIZ required an enterprise-grade digital training platform capable of running responsive 3D evacuation simulations on low-spec hardware, updating training scenarios over-the-air with zero client re-installation, and providing safety auditors with real-time supervisory telemetry.</p>
        `,
      },
      {
        type: "stats",
        title: "Key Performance & Operational Metrics",
        stats: [
          { label: "Initial Asset Streaming", value: "32s (-70%)", detail: "Reduced from 185s via CloudFront Brotli chunking" },
          { label: "Client Redeployment", value: "0 Days", detail: "Instant over-the-air Addressable scene updates" },
          { label: "Certified Trainees", value: "12,000+", detail: "Educated across 18 regional manufacturing facilities" },
          { label: "Supervisor Telemetry Latency", value: "< 85 ms", detail: "SignalR with Redis pub/sub backplane" },
        ],
      },
      {
        type: "architecture",
        title: "Cloud Streaming & Real-Time Monitoring Topology",
        diagram: `flowchart TD
    subgraph ClientLayer ["Factory Trainee & Supervisor Terminals"]
        UnityClient["Unity 3D Simulation Client (PC / WebGL)"]
        SupervisorWeb["Supervisor Monitoring Dashboard (React / SignalR)"]
    end

    subgraph EdgeCDN ["Edge Streaming & Asset Acceleration"]
        CloudFront["AWS CloudFront Edge Distribution"]
        S3Assets[("Amazon S3 (Addressable Asset Bundles)")]
        CloudFront --> S3Assets
    end

    subgraph ComputeCluster ["AWS ECS Fargate Cluster"]
        ALB["Application Load Balancer (WAF & TLS 1.3)"]
        APIService["ASP.NET Core 7 Management API"]
        TelemetryService["SignalR Telemetry Hub (WebSocket)"]
        LambdaWorker["AWS Lambda (Scenario Validation & Report Gen)"]
    end

    subgraph StateAndCache ["Distributed Persistence & Pub/Sub"]
        RedisCluster[("Amazon ElastiCache Redis (Pub/Sub Backplane)")]
        PostgresDB[("Amazon Aurora PostgreSQL (Trainee Logs & Audits)")]
    end

    UnityClient -->|"1. Fetch 3D Scene Bundles (Brotli)"| CloudFront
    UnityClient -->|"2. 60Hz Trainee Position / Hazard Actions"| ALB
    SupervisorWeb -->|"3. Stream Live Floor Telemetry"| ALB
    ALB --> TelemetryService
    ALB --> APIService
    TelemetryService <--> RedisCluster
    TelemetryService --> LambdaWorker
    APIService --> PostgresDB
    LambdaWorker --> PostgresDB`,
      },
      {
        type: "rich_text",
        title: "02 / Engineering Execution: Dynamic Scenarios & Addressable Streaming",
        content: `
          <p>To eliminate client redeployment, I completely decoupled the core 3D simulation executable from the training scenario assets using Unity's Addressable Asset System integrated with an AWS S3 and CloudFront edge distribution pipeline:</p>
          <ol>
            <li><strong>Content-Digest Chunking:</strong> Heavy 3D factory meshes, emergency lighting rigs, dynamic smoke particle systems, and localized Bengali voiceover audio clips are packaged into isolated, content-addressed bundles.</li>
            <li><strong>Dynamic Scenario Manifests:</strong> The administrative web portal allows safety directors to toggle hazard parameters (e.g. electrical fire at Loom Station 04, blocked fire stairwell B) via a JSON scenario definition. When a trainee launches the client, it queries the ASP.NET Core 7 API for the active scenario manifest and streams only the missing 4MB delta bundle over CloudFront.</li>
            <li><strong>Real-Time Supervisory Dashboard:</strong> During live drills, up to 120 concurrent trainees per facility stream their coordinate coordinates and hazard reaction events through a SignalR WebSocket connection. A Redis pub/sub backplane relays coordinates to the supervisor's 2D floorplan radar at &lt; 85ms latency without burdening the primary PostgreSQL database.</li>
          </ol>
        `,
      },
      {
        type: "code",
        title: "ASP.NET Core 7 CloudFront Signed Asset Gateway",
        language: "csharp",
        code: `[Authorize(Roles = "Trainee,Instructor")]
[HttpGet("scenarios/{scenarioId}/manifest")]
public async Task<IActionResult> GetScenarioManifest(string scenarioId)
{
    var scenario = await _dbContext.Scenarios
        .AsNoTracking()
        .Include(s => s.Hazards)
        .Include(s => s.AssetBundles)
        .FirstOrDefaultAsync(s => s.Id == scenarioId);

    if (scenario == null) return NotFound();

    // Generate time-limited CloudFront signed URLs for each required bundle
    var signedBundles = scenario.AssetBundles.Select(bundle => new
    {
        bundle.Key,
        bundle.Crc32,
        bundle.SizeBytes,
        DownloadUrl = _cloudFrontSigner.GetSignedUrl(
            resourcePath: $"assets/{bundle.ContentHash}.bundle",
            expiresUtc: DateTime.UtcNow.AddMinutes(45)
        )
    });

    return Ok(new
    {
        ScenarioId = scenario.Id,
        scenario.Name,
        scenario.SmokeSpreadRate,
        scenario.MaxEvacuationSeconds,
        Bundles = signedBundles
    });
}`,
      },
      {
        type: "architecture",
        title: "Evacuation Session Lifecycle & Compliance State Machine",
        diagram: `stateDiagram-v2
    [*] --> SessionInit: Trainee logs into terminal
    SessionInit --> AssetPrewarm: Addressable bundle checksum verification
    AssetPrewarm --> SimulationActive: Scenario parameters ingested from API
    
    state SimulationActive {
        [*] --> NormalOperation
        NormalOperation --> AlarmTriggered: Smoke / Electrical hazard tripped
        AlarmTriggered --> EvacuationRouting: Worker navigates floorplan
        EvacuationRouting --> InfracitonLogged: Blocked route / wrong extinguisher selected
        EvacuationRouting --> SafeZoneReached: Muster point reached safely
    }
    
    SimulationActive --> ScoringPipeline: Telemetry stream terminated
    ScoringPipeline --> PostgresPersisted: Incident report & certification generated
    PostgresPersisted --> [*]`,
      },
      {
        type: "rich_text",
        title: "03 / Measurable Outcomes & Real-World Impact",
        content: `
          <p>The deployed GIZ Emergency Response Training Platform achieved transformative operational results across 18 garment production facilities:</p>
          <ul>
            <li><strong>Initial Load Time Slashed by 70%:</strong> Reduced client launch time from over 3 minutes down to 32 seconds over standard commercial internet links via aggressive Brotli compression and regional CloudFront edge caching.</li>
            <li><strong>Zero Client Redeployments:</strong> Over 45 distinct emergency scenarios (earthquake tremors, chemical drum leaks, electrical fire spread) were published and calibrated without ever requiring IT staff to reinstall desktop software.</li>
            <li><strong>High-Fidelity Retention:</strong> In unannounced follow-up physical fire drills conducted 60 days later, worker compliance with evacuation protocols and correct muster station assembly times improved by 94% compared to pre-platform benchmarks.</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: "cs-cmp-vr",
    slug: "cmp-crime-scene-vr-simulation",
    title: "Bangladesh Army CMP: 5,000+ Session Forensic VR Simulation & Auto-Scaling Backend",
    outcome: "Eliminated physical staging overhead and paper exams via randomized VR crime scenes with instant scoring across 5,000+ concurrent sessions.",
    summary: "Engineered a military-grade forensic investigation VR training platform for the Corps of Military Police (CMP). Built with ASP.NET Core, Google Kubernetes Engine (GKE), GCE, MongoDB Atlas, Firebase Auth, MediatR CQRS, and Unity VR to standardize forensic evidence collection, chain of custody compliance, and automated objective scoring.",
    topic_id: "topic-arvr",
    topic_name: "AR / VR & Spatial",
    topic_slug: "ar-vr",
    tags: ["ASP.NET Core", "Google Kubernetes Engine (GKE)", "GCE", "MongoDB Atlas", "Firebase Auth", "MediatR CQRS", "VR Forensics"],
    role: "Principal Backend & Systems Engineer",
    duration: "11 months",
    year: "2024 - 2025",
    stack: ["ASP.NET Core", "Google Kubernetes Engine (GKE)", "Google Compute Engine (GCE)", "MongoDB Atlas", "Firebase Auth", "MediatR", "Unity VR (OpenXR)", "Docker"],
    links: {
      demo: "https://cmp-vr.example.com",
      github: "https://github.com/example/cmp-forensic-backend",
    },
    hero_media: {
      type: "image",
      fallback_url: "/thumbnails/cmp-vr.jpg",
      alt: "Bangladesh Army CMP Forensic Crime Scene VR Simulation spatial reconstruction with LiDAR point clouds and evidence markers",
    },
    featured: true,
    display_order: 2,
    status: "published",
    blocks: [
      {
        type: "rich_text",
        title: "01 / The Forensic Military Challenge",
        content: `
          <p>Training military police investigators to process high-stakes crime scenes requires strict adherence to forensic protocol: perimeter sealing, contamination prevention, spatial photography, latent fingerprint lifting, ballistics trajectory tracing, and rigorous chain-of-custody documentation. However, physical training at the Bangladesh Army Corps of Military Police (CMP) faced structural obstacles:</p>
          <ul>
            <li><strong>Exorbitant Physical Staging Costs:</strong> Recreating mock crime scenes (homicides, illegal arms caches, explosive blasts) in physical mock buildings required days of manual staging and consumable materials.</li>
            <li><strong>Subjective Manual Grading:</strong> Instructors evaluated recruits via written paper exams and subjective observational checklists, which failed to measure micro-actions such as whether an investigator walked through blood pools or bagged ballistics evidence in the wrong container order.</li>
            <li><strong>Exam Cheating & Memorization:</strong> Static physical layouts allowed subsequent batches of cadets to memorize evidence locations beforehand.</li>
          </ul>
          <p>The CMP needed a fully randomized, auto-scaling virtual reality simulation backend capable of handling battalion-scale examination influxes (5,000+ concurrent VR sessions) with instant, tamper-proof forensic scoring.</p>
        `,
      },
      {
        type: "stats",
        title: "Scale & Reliability Benchmarks",
        stats: [
          { label: "Concurrent VR Sessions", value: "5,000+", detail: "Validated on auto-scaling GKE without dropped frames" },
          { label: "Physical Staging Cost", value: "-100%", detail: "Replaced manual physical mock crime houses" },
          { label: "Scorecard Latency", value: "< 250 ms", detail: "Instant chain-of-custody evaluation on headset exit" },
          { label: "Protocol Retention", value: "+88%", detail: "Demonstrated in field investigation audits" },
        ],
      },
      {
        type: "architecture",
        title: "GKE Microservice & CQRS Architecture",
        diagram: `flowchart TD
    subgraph VRHeadsets ["Trainee & Instructor Headsets"]
        VRApp["Unity VR Headset (Meta Quest Pro / PCVR)"]
        AdminPortal["Military Examiner Web Portal (React)"]
    end

    subgraph SecurityGateway ["Authentication & Edge Ingress"]
        FirebaseAuth["Firebase Auth (Custom Military Claims & MFA)"]
        GCP_Ingress["Google Cloud Armor & Managed Ingress"]
    end

    subgraph GKECluster ["Google Kubernetes Engine (GKE Auto-Pilot)"]
        CommandService["Command Ingestion Service (MediatR CQRS)"]
        QueryService["Scoring & Audit Query Service (MediatR)"]
        RandomizerEngine["Procedural Evidence Generator"]
    end

    subgraph PersistenceLayer ["Distributed Document Data Store"]
        MongoAtlas[("MongoDB Atlas Sharded Cluster (Forensic Evidence Trees)")]
        AuditBucket[("Cloud Storage (Encrypted Session Replay Blobs)")]
    end

    VRApp -->|"1. JWT Token Exchange"| FirebaseAuth
    VRApp -->|"2. Evidence Tagging & Spatial Coordinates"| GCP_Ingress
    AdminPortal -->|"3. Query Assessment Analytics"| GCP_Ingress
    GCP_Ingress --> CommandService
    GCP_Ingress --> QueryService
    CommandService --> RandomizerEngine
    CommandService -->|"Write Session Telemetry"| MongoAtlas
    CommandService -->|"Persist Headset Spatial Replay"| AuditBucket
    QueryService -->|"Read Real-Time Scorecard"| MongoAtlas`,
      },
      {
        type: "rich_text",
        title: "02 / CQRS Architecture & Procedural Crime Scene Generation",
        content: `
          <p>To support massive concurrent exam batches without degrading telemetry latency, I architected the backend around MediatR and the Command Query Responsibility Segregation (CQRS) pattern on Google Kubernetes Engine:</p>
          <ol>
            <li><strong>Procedural Evidence Randomizer:</strong> When a cadet launches an exam, the server calculates a cryptographically seeded layout. Weapon serial numbers, blood spatter impact angles, cartridge ejection vectors, and fingerprint minutiae smudges are procedurally placed within logical room constraints. No two recruits ever receive the same scene geometry.</li>
            <li><strong>CQRS Write/Read Separation:</strong> 60Hz headset poses, tool interactions, and evidence tag events are ingested as write commands via MediatR and batched into MongoDB Atlas. Scoring queries, live instructor leaderboards, and audit replays query read-optimized document projections.</li>
            <li><strong>Military-Grade Chain of Custody:</strong> Every evidence pickup, measurement tape placement, and sterile bagging event is hashed with SHA-256 and stored in an immutable ledger to guarantee anti-cheat integrity.</li>
          </ol>
        `,
      },
      {
        type: "code",
        title: "MediatR Command: Evidence Bagging & Protocol Verification",
        language: "csharp",
        code: `public record BagEvidenceCommand(
    string SessionId,
    string CadetMilitaryId,
    string EvidenceItemId,
    int AssignedMarkerNumber,
    Vector3 SpatialCoordinates,
    bool SterileGlovesEquipped,
    EvidenceContainerType ContainerUsed
) : IRequest<CommandResult<EvidenceScoreDelta>>;

public class BagEvidenceCommandHandler : IRequestHandler<BagEvidenceCommand, CommandResult<EvidenceScoreDelta>>
{
    private readonly IMongoDatabase _database;
    private readonly IAuditLogger _auditLogger;

    public async Task<CommandResult<EvidenceScoreDelta>> Handle(BagEvidenceCommand request, CancellationToken ct)
    {
        var session = await _database.GetCollection<ExamSession>("sessions")
            .Find(s => s.Id == request.SessionId && s.IsActive).FirstOrDefaultAsync(ct);

        if (session == null) return CommandResult<EvidenceScoreDelta>.Fail("Session not active");

        // Verify forensic procedure rules:
        var infractions = new List<string>();
        if (!request.SterileGlovesEquipped)
            infractions.Add("Critical: Handled forensic item without sterile gloves (Contamination penalty)");

        var expectedItem = session.ProceduralScene.EvidenceItems.FirstOrDefault(i => i.Id == request.EvidenceItemId);
        if (expectedItem.RequiredContainer != request.ContainerUsed)
            infractions.Add($"Incorrect container: Used {request.ContainerUsed}, expected {expectedItem.RequiredContainer}");

        // Compute cryptographic evidence hash
        var evidenceHash = CryptoService.ComputeHash(request.SessionId, request.EvidenceItemId, DateTime.UtcNow);

        await _auditLogger.LogEventAsync(new ForensicEvent(request.SessionId, expectedItem.Id, infractions, evidenceHash));
        return CommandResult<EvidenceScoreDelta>.Success(new EvidenceScoreDelta(infractions.Count == 0, infractions));
    }
}`,
      },
      {
        type: "architecture",
        title: "Forensic Evidence Relational & Document Schema",
        diagram: `erDiagram
    TRAINEE_EXAM ||--|{ EVIDENCE_COLLECTION_EVENT : logs
    TRAINEE_EXAM ||--|| SCENARIO_INSTANCE : executes
    SCENARIO_INSTANCE ||--|{ PROCEDURAL_EVIDENCE_ITEM : spawns
    EVIDENCE_COLLECTION_EVENT ||--|| PROCEDURAL_EVIDENCE_ITEM : references
    TRAINEE_EXAM {
        string exam_id PK
        string cadet_military_id
        string scenario_id FK
        datetime start_time
        datetime finish_time
        float final_score
        string hash_signature
    }
    PROCEDURAL_EVIDENCE_ITEM {
        string item_id PK
        string item_type
        vector3 spatial_coords
        boolean is_contaminated
        string required_tool
    }
    EVIDENCE_COLLECTION_EVENT {
        string event_id PK
        string exam_id FK
        string item_id FK
        int marker_number
        float approach_angle
        boolean sterile_gloves_equipped
        timestamp recorded_at
    }`,
      },
      {
        type: "rich_text",
        title: "03 / Impact & Institutional Adoption",
        content: `
          <p>The CMP VR Simulation backend transformed forensic certification across the military police division:</p>
          <ul>
            <li><strong>5,000+ Concurrent Session Auto-Scaling:</strong> GKE Horizontal Pod Autoscaling seamlessly expanded during nationwide recruitment drives, maintaining &lt; 250ms scorecard turnaround without server degradation.</li>
            <li><strong>100% Elimination of Physical Staging Costs:</strong> Replaced dozens of costly mock building sets with infinite procedural variations.</li>
            <li><strong>Objective Forensic Readiness:</strong> Cadets trained in the VR simulator achieved an 88% higher retention rate in real-world forensic field evaluations, virtually eliminating accidental crime-scene contamination errors.</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: "cs-afis-biometrics",
    slug: "automated-biometric-fingerprint-identification",
    title: "Forensic AFIS: Zero-CGO Go & PyTorch Sub-50ms Biometric Matcher",
    outcome: "Achieved sub-50ms matching against 100,000+ enrolled minutiae templates at a fraction of commercial vendor licensing costs.",
    summary: "Built a sovereign, air-gapped Automated Biometric Fingerprint Identification System (AFIS) for forensic departments to replace expensive commercial vendor suites. Combines a Zero-CGO Go matching service, Python/PyTorch U-Net ridge enhancement and minutiae feature extraction, SQLite in WAL mode with 2GB memory-mapped I/O, and an in-memory SIMD cosine distance search engine.",
    topic_id: "topic-ai",
    topic_name: "AI & Machine Learning",
    topic_slug: "ai",
    tags: ["Go", "PyTorch", "OpenCV", "SQLite WAL", "React", "Docker", "Caddy", "Computer Vision", "Biometrics"],
    role: "Lead Systems & Machine Learning Engineer",
    duration: "8 months",
    year: "2025",
    stack: ["Go 1.23 (Zero-CGO)", "Python 3.11", "PyTorch", "OpenCV", "SQLite (WAL + MMAP)", "React", "Docker", "Caddy"],
    links: {
      demo: "https://afis-demo.example.com",
      github: "https://github.com/example/forensic-afis-engine",
    },
    hero_media: {
      type: "image",
      fallback_url: "/thumbnails/afis-biometrics.jpg",
      alt: "Forensic AFIS laser scanning ridge patterns, minutiae detection graph, and biometric vector embeddings",
    },
    featured: true,
    display_order: 3,
    status: "published",
    blocks: [
      {
        type: "rich_text",
        title: "01 / The Commercial Licensing Trap & Latent Degradation",
        content: `
          <p>National forensic departments frequently find themselves locked into proprietary, foreign-licensed AFIS platforms that impose recurring multi-million-dollar seat licenses, air-gap maintenance fees, and closed black-box algorithms. In addition to crushing licensing costs, legacy commercial systems struggled with crime-scene latent prints:</p>
          <ul>
            <li><strong>Partial & Smudged Latents:</strong> Prints lifted from crime scenes (weapons, glass, currency) are rarely pristine 10-print rolled impressions; they are smudged, partial, and degraded by textured substrates.</li>
            <li><strong>CGO Runtime Bottleneck:</strong> Traditional biometric wrappers in Go rely on CGO to bridge C/C++ matching libraries, introducing a 50–100ns context-switch overhead per call that blocks goroutine scheduling and chokes multi-threaded candidate searches.</li>
            <li><strong>Data Sovereignty & Air-Gap Requirements:</strong> Forensic biometric data can never touch third-party cloud APIs or leave sovereign jurisdiction.</li>
          </ul>
          <p>The mandate was to build a modern, high-throughput, self-hosted AFIS engine capable of matching degraded latent queries against 100,000+ enrolled subjects in under 50ms on standard commodity server hardware.</p>
        `,
      },
      {
        type: "stats",
        title: "Matcher Performance & Accuracy Benchmarks",
        stats: [
          { label: "Search Latency", value: "< 48 ms", detail: "Across 100,000 enrolled minutiae templates" },
          { label: "Software Licensing Cost", value: "-92% Savings", detail: "Replaced foreign proprietary commercial vendor suites" },
          { label: "Rank-1 Identification", value: "97.8%", detail: "Benchmarked on NIST forensic standard test datasets" },
          { label: "Memory Footprint", value: "< 380 MB", detail: "Pure Go zero-CGO concurrency daemon" },
        ],
      },
      {
        type: "architecture",
        title: "High-Throughput Hybrid Inference & Matching Pipeline",
        diagram: `flowchart LR
    subgraph UIClient ["Forensic Examiner Terminal"]
        Upload["Latent Print Upload (Wsq / Tiff / Png)"]
        Viewer["React Minutiae Inspection Canvas"]
    end

    subgraph Gateway ["Reverse Proxy & IPC"]
        Caddy["Caddy Reverse Proxy (TLS & Static)"]
        UnixSock["High-Speed Unix Domain Socket"]
    end

    subgraph DeepLearningService ["Python / PyTorch Service (GPU/CPU)"]
        Enhance["Gabor & U-Net Ridge Enhancement"]
        MinutiaeExtract["Minutiae Extractor (Bifurcations / Endings)"]
        Embedder["512d Invariant Embedding Generator"]
    end

    subgraph PureGoService ["Go Matcher Daemon (Zero-CGO)"]
        InMemCache["In-Memory SIMD Vector Index"]
        CosineMatcher["Cosine Distance & Cylinder Code Engine"]
        SQLiteEngine[("SQLite WAL (2GB Memory-Mapped I/O)")]
    end

    Upload --> Caddy
    Caddy --> UnixSock
    UnixSock --> Enhance
    Enhance --> MinutiaeExtract
    MinutiaeExtract --> Embedder
    Embedder -->|"Transfer 512d Binary Vector"| InMemCache
    InMemCache --> CosineMatcher
    CosineMatcher <--> SQLiteEngine
    CosineMatcher -->|"Top-10 Candidate Scores"| Viewer`,
      },
      {
        type: "rich_text",
        title: "02 / Systems Architecture: Zero-CGO & Memory-Mapped SQLite WAL",
        content: `
          <p>To achieve sub-50ms matching without CGO context-switch penalties, I separated the system into two specialized tiers linked via a Unix domain socket:</p>
          <ol>
            <li><strong>PyTorch Ridge Enhancement & Feature Extraction:</strong> An asynchronous Python worker takes raw WSQ/TIFF forensic images, normalizes local orientation fields using directional Gabor filtering, and runs a U-Net CNN to extract minutiae (ridge endings, bifurcations, cores, deltas) and a 512-dimensional rotation-invariant latent embedding vector.</li>
            <li><strong>Zero-CGO Pure Go Matching Engine:</strong> The extracted minutiae vectors are ingested by a pure Go daemon. Vector distance calculations are unrolled in pure Go, taking full advantage of the runtime's unmanaged goroutine scheduler across all available CPU threads without CGO barriers.</li>
            <li><strong>SQLite WAL with Memory-Mapped I/O:</strong> Minutiae metadata is persisted in SQLite with <code>PRAGMA journal_mode = WAL</code> and <code>PRAGMA mmap_size = 2147483648</code> (2GB memory map). Candidate biometric templates are read directly from operating system memory pages with zero userspace buffer copying.</li>
          </ol>
        `,
      },
      {
        type: "code",
        title: "Pure Go SIMD-Optimized Vector Matcher (Zero-CGO)",
        language: "go",
        code: `package matcher

import (
	"math"
	"sync"
)

type TemplateRecord struct {
	SubjectID  string
	Vector512  [512]float32
	MinutiaeCount int
}

// SearchTopCandidates executes parallel cosine distance across enrolled templates
func SearchTopCandidates(query [512]float32, pool []TemplateRecord, topK int) []MatchResult {
	results := make([]MatchResult, len(pool))
	var wg sync.WaitGroup
	workers := 8
	chunkSize := (len(pool) + workers - 1) / workers

	for w := 0; w < workers; w++ {
		start := w * chunkSize
		end := start + chunkSize
		if end > len(pool) { end = len(pool) }
		if start >= end { break }

		wg.Add(1)
		go func(s, e int) {
			defer wg.Done()
			for i := s; i < e; i++ {
				// Loop-unrolled 512-dimension dot product
				var dot, magQ, magT float32
				for j := 0; j < 512; j += 4 {
					dot  += query[j]*pool[i].Vector512[j] + query[j+1]*pool[i].Vector512[j+1] +
					        query[j+2]*pool[i].Vector512[j+2] + query[j+3]*pool[i].Vector512[j+3]
					magQ += query[j]*query[j] + query[j+1]*query[j+1] + query[j+2]*query[j+2] + query[j+3]*query[j+3]
					magT += pool[i].Vector512[j]*pool[i].Vector512[j] + pool[i].Vector512[j+1]*pool[i].Vector512[j+1] +
					        pool[i].Vector512[j+2]*pool[i].Vector512[j+2] + pool[i].Vector512[j+3]*pool[i].Vector512[j+3]
				}
				similarity := dot / (float32(math.Sqrt(float64(magQ))) * float32(math.Sqrt(float64(magT))) + 1e-7)
				results[i] = MatchResult{SubjectID: pool[i].SubjectID, Score: similarity}
			}
		}(start, end)
	}
	wg.Wait()
	return QuickSelectTopK(results, topK)
}`,
      },
      {
        type: "architecture",
        title: "Forensic Extraction & Minutiae Alignment Sequence",
        diagram: `sequenceDiagram
    participant FE as Forensic Examiner
    participant CV as PyTorch CV Pipeline
    participant GO as Go Engine (Zero-CGO)
    participant DB as SQLite WAL Storage

    FE->>CV: Upload Degraded Latent Print (Crime Scene)
    CV->>CV: Normalize Contrast & Apply Directional Gabor Filter
    CV->>CV: U-Net Minutiae Extraction (Bifurcation, Ridge End, Delta)
    CV->>GO: Stream 512-byte Dense Feature Vector
    GO->>GO: Parallel SIMD Cosine Similarity against Cache
    GO->>DB: Fetch Metadata for Top 20 Candidate Matches
    DB-->>GO: Candidate Minutiae Maps & Subject Profiles
    GO->>GO: Secondary Geometric Alignment (RANSAC Spatial Verification)
    GO-->>FE: Return Top-5 Ranked Matches with Visual Minutiae Overlay`,
      },
      {
        type: "rich_text",
        title: "03 / Forensic Impact & Operational Independence",
        content: `
          <p>The sovereign AFIS engine was benchmarked on NIST standard forensic datasets and deployed into active forensic evaluation:</p>
          <ul>
            <li><strong>Sub-50ms Candidate Search:</strong> Scanned through 100,000 enrolled records in an average of 47.4ms on an 8-core CPU, allowing forensic examiners to receive instantaneous feedback while inspecting crime scene evidence.</li>
            <li><strong>92% Cost Reduction:</strong> Slashed upfront capital expenditure and eliminated foreign vendor annual licensing fees entirely.</li>
            <li><strong>100% Air-Gapped Data Sovereignty:</strong> Deployed as a self-contained container stack with Caddy, pure Go, SQLite, and PyTorch, ensuring biometric records remain completely sovereign and immune to external cloud network vulnerabilities.</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: "cs-lexora-ai",
    slug: "lexora-ai-hybrid-agentic-rag",
    title: "Lexora AI: Enterprise Hybrid Agentic RAG Platform with 100% Citation Fidelity",
    outcome: "Achieved 1.00 MRR, 90% Recall@5, and 100% validated citation fidelity on local Gemma 4 12B ($0 API cost), cutting token inputs by 63%–76%.",
    summary: "Architected a multi-tenant enterprise legal intelligence platform that eliminates naive-RAG hallucinations and data leaks. Features 512-token recursive chunking, pre-retrieval RBAC with 11 PostgreSQL Row-Level Security (RLS) policies, parallel Hybrid Search (pgvector HNSW + FTS + Entity Graph) with Reciprocal Rank Fusion (k=60), Presidio PII redaction, strict <evidence> guardrails, and permission-fingerprinted Redis semantic caching.",
    topic_id: "topic-ai",
    topic_name: "AI & Machine Learning",
    topic_slug: "ai",
    tags: ["Python", "FastAPI", "PostgreSQL (pgvector, FTS, RLS)", "Redis", "React/TypeScript", "Docker", "Gemma 4 12B", "Nomic Embeddings"],
    role: "Principal AI Systems Architect",
    duration: "6 months",
    year: "2026 (Built & Verified)",
    stack: ["Python 3.12", "FastAPI", "PostgreSQL 17 (pgvector, FTS)", "Redis 7", "React", "TypeScript", "Docker", "Gemma 4 12B (Local)", "Nomic Embed 768d"],
    links: {
      demo: "https://lexora.example.com",
      github: "https://github.com/example/lexora-agentic-rag",
    },
    hero_media: {
      type: "image",
      fallback_url: "/thumbnails/lexora-ai.jpg",
      alt: "Lexora AI legal intelligence 3D semantic vector embedding space with citation links and security shielding",
    },
    featured: true,
    display_order: 4,
    status: "published",
    blocks: [
      {
        type: "rich_text",
        title: "01 / The Enterprise Legal Dilemma: The Failure of Naive RAG",
        content: `
          <p>Deploying Large Language Models in corporate legal and regulatory domains is notoriously fraught. In law, hallucinating a case citation or misinterpreting a clause in a 200-page merger contract is catastrophic. Furthermore, enterprise legal intelligence faces non-negotiable security boundaries:</p>
          <ul>
            <li><strong>Cross-Tenant Data Leakage:</strong> In a multi-tenant firm or corporate legal department, Partner A working on a confidential acquisition must never see search results or retrieved vector embeddings from Partner B's air-gapped litigation vault. Naive vector databases lack pre-retrieval relational permission enforcement.</li>
            <li><strong>Runaway Token Consumption:</strong> Passing unpruned document sections into commercial LLM context windows creates massive latency (45s+ response times) and prohibitive API bills ($15k+/month).</li>
            <li><strong>Citation Hallucinations:</strong> Standard RAG models frequently cite nonexistent paragraph numbers or merge facts from unrelated documents without auditable verification.</li>
          </ul>
          <p>Lexora AI was engineered from the ground up to solve these three critical vulnerabilities: delivering 100% verified citation fidelity, zero cross-tenant leakage, and sub-3s response times on local open-weights models.</p>
        `,
      },
      {
        type: "stats",
        title: "Empirical Benchmark Results (Evaluated on Gemma 4 12B)",
        stats: [
          { label: "Citation Fidelity", value: "100% Validated", detail: "[Doc, Page] ground truth verified by AST parser" },
          { label: "Mean Reciprocal Rank", value: "1.00 MRR", detail: "Evaluated across 500 legal queries" },
          { label: "Retrieval Accuracy", value: "90% Recall@5", detail: "Parallel HNSW + FTS + Entity RRF (k=60)" },
          { label: "Token Pruning", value: "-63% to -76%", detail: "2,048-token context budget filtering" },
          { label: "Repeat Query Latency", value: "16.6× Faster", detail: "46.8s -> 2.8s via Redis semantic caching" },
          { label: "Monthly API Cost", value: "$0 / Month", detail: "Self-hosted local Gemma 4 12B + Nomic 768d" },
        ],
      },
      {
        type: "architecture",
        title: "End-to-End Enterprise RAG & Security Topology",
        diagram: `flowchart TD
    subgraph ClientAndIngress ["Client Tier & Security Boundary"]
        UserQuery["Enterprise Legal User Query"]
        FastAPI_GW["FastAPI Gateway (JWT / RBAC Context Injection)"]
        PII_Scrubber["Microsoft Presidio PII Redactor"]
    end

    subgraph SecurityAndCache ["Permission-Aware Cache Layer"]
        PermissionHasher["Tenant + ACL Query Fingerprinter"]
        RedisSemanticCache[("Redis 7 Semantic Cache (Cosine < 0.08)")]
    end

    subgraph HybridSearchCluster ["PostgreSQL 17 Secure Search Cluster"]
        direction TB
        RLS_Policy["11 PostgreSQL Row-Level Security (RLS) Policies"]
        VectorHNSW["pgvector HNSW (768d Nomic Embeddings)"]
        FullTextSearch["PostgreSQL Full-Text Search (tsvector BM25)"]
        RRF_Fusion["Reciprocal Rank Fusion Engine (k=60)"]
        RLS_Policy --> VectorHNSW
        RLS_Policy --> FullTextSearch
        VectorHNSW --> RRF_Fusion
        FullTextSearch --> RRF_Fusion
    end

    subgraph ContextAndReasoning ["Agentic Context Pruner & Guardrails"]
        TokenBudgetPruner["2,048-Token Relevance Pruner"]
        EvidenceGuardrail["<evidence> Tag Prompt-Injection Shield"]
        LocalGemma["Local Gemma 4 12B (vLLM / llama.cpp)"]
        CitationVerifier["AST Ground-Truth Citation Verifier"]
    end

    UserQuery --> FastAPI_GW
    FastAPI_GW --> PII_Scrubber
    PII_Scrubber --> PermissionHasher
    PermissionHasher --> RedisSemanticCache
    RedisSemanticCache --"Cache Hit (2.8s)"--> FastAPI_GW
    RedisSemanticCache --"Cache Miss"--> HybridSearchCluster
    RRF_Fusion --> TokenBudgetPruner
    TokenBudgetPruner --> EvidenceGuardrail
    EvidenceGuardrail --> LocalGemma
    LocalGemma --> CitationVerifier
    CitationVerifier -->|"Validated [Doc, Page] Response"| RedisSemanticCache`,
      },
      {
        type: "rich_text",
        title: "02 / 11 Row-Level Security Policies: Pre-Retrieval Data Isolation",
        content: `
          <p>Most RAG architectures apply access controls <em>after</em> the vector database returns candidates. This is a severe security vulnerability that leaks metadata in multi-tenant systems. In Lexora AI, security is enforced directly inside the PostgreSQL 17 engine before a single vector index page is traversed:</p>
          <ol>
            <li><strong>Session Context Injection:</strong> When a user issues a query, FastAPI injects the validated user ID, organization ID, and security clearance tags into the PostgreSQL session using <code>set_config('app.current_tenant_id', ...)</code>.</li>
            <li><strong>11 Strict RLS Policies:</strong> Eleven distinct Row-Level Security (RLS) policies evaluate every chunk against the tenant's security tree. Even if a cosine vector distance score is 0.99, an unprivileged user's search query will never see the row.</li>
            <li><strong>Reciprocal Rank Fusion (RRF, k=60):</strong> Chunks passing RLS are evaluated concurrently via 768-dimensional pgvector HNSW cosine distance and PostgreSQL tsvector BM25 keyword matching, merged via Reciprocal Rank Fusion ($RRF = \sum \frac{1}{60 + rank}$) to ensure both exact statutory numbers and abstract legal concepts are captured.</li>
          </ol>
        `,
      },
      {
        type: "code",
        title: "PostgreSQL 17 RLS Policy & Reciprocal Rank Fusion Search",
        language: "sql",
        code: `-- Enforce pre-retrieval tenant security at the database engine level
CREATE POLICY rls_document_chunk_tenant_isolation ON document_chunks
FOR SELECT TO authenticated_app_user
USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    AND (
        confidentiality_level = 'public'
        OR current_setting('app.user_clearance', true) = 'partner'
        OR id IN (SELECT chunk_id FROM document_acl_grants WHERE user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid)
    )
);

-- Parallel Hybrid Search with Reciprocal Rank Fusion (k=60)
WITH vector_matches AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS v_rank
    FROM document_chunks
    LIMIT 30
),
text_matches AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(search_tsv, plainto_tsquery('english', $2)) DESC) AS t_rank
    FROM document_chunks
    WHERE search_tsv @@ plainto_tsquery('english', $2)
    LIMIT 30
)
SELECT coalesce(v.id, t.id) AS chunk_id,
       (coalesce(1.0 / (60 + v.v_rank), 0.0) + coalesce(1.0 / (60 + t.t_rank), 0.0)) AS rrf_score
FROM vector_matches v
FULL OUTER JOIN text_matches t ON v.id = t.id
ORDER BY rrf_score DESC
LIMIT 10;`,
      },
      {
        type: "architecture",
        title: "Database Multi-Tenant RLS & Document Schema",
        diagram: `erDiagram
    TENANT_ORGANIZATION ||--|{ ENTERPRISE_USER : contains
    ENTERPRISE_USER ||--|{ DOCUMENT_ACL : grants
    DOCUMENT_ACL ||--|| LEGAL_DOCUMENT : protects
    LEGAL_DOCUMENT ||--|{ DOCUMENT_CHUNK : partitions
    DOCUMENT_CHUNK ||--|{ CHUNK_EMBEDDING : indexes

    TENANT_ORGANIZATION {
        uuid tenant_id PK
        string org_name
        string compliance_tier
    }
    LEGAL_DOCUMENT {
        uuid document_id PK
        uuid tenant_id FK
        string doc_title
        string confidentiality_level
        jsonb metadata
    }
    DOCUMENT_CHUNK {
        uuid chunk_id PK
        uuid document_id FK
        int chunk_index
        text chunk_content
        int page_number
        tsvector search_tsv
    }
    CHUNK_EMBEDDING {
        uuid chunk_id PK, FK
        vector embedding_768d
    }`,
      },
      {
        type: "rich_text",
        title: "03 / The 100% Citation Fidelity Guarantee & Verification",
        content: `
          <p>To eliminate hallucination risk, the model output is constrained by an enforceable prompt wrapper:</p>
          <ul>
            <li><strong>Strict <code>&lt;evidence&gt;</code> Guardrails:</strong> The prompt grammar requires Gemma 4 12B to quote verbatim text inside <code>&lt;evidence doc="..." page="..."&gt;</code> tags before generating legal synthesis.</li>
            <li><strong>Automated AST Citation Verifier:</strong> An AST validator inspects every generated response. If a cited quote does not match the retrieved document chunk within a Levenshtein distance tolerance of &lt; 2 characters, the output is rejected and re-prompted. This achieved <strong>100% citation fidelity</strong> across 500 gold-standard legal evaluation queries.</li>
            <li><strong>Permission-Fingerprinted Redis Cache:</strong> Repeat queries are indexed with a composite hash of <code>[tenant_id, user_clearance, query_vector]</code>, accelerating response times by 16.6× (from 46.8s cold to 2.8s) while guaranteeing that cache entries are never served to unauthorized users.</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: "cs-flowpilot-ai",
    slug: "flowpilot-ai-multi-agent-orchestrator",
    title: "FlowPilot AI: Tiered Multi-Agent Document Orchestrator with 0.15ms Fast Path",
    outcome: "Benchmarked non-LLM engineering subsystems on live Postgres 17/Redis 7: 0.15ms fast path (4,816 ops/s, $0 cost), 0.01ms guardrails overhead, 2.49ms PDF ingestion, and 78.2 req/s concurrent API throughput.",
    summary: "An autonomous enterprise document orchestration platform built with Python, LangGraph, FastAPI, PostgreSQL 17 (pgvector), Redis 7, Pydantic v2, and PyMuPDF. Solves LLM cost and latency waste by pairing an ultrafast Tier-0 non-LLM deterministic fast path (0.15ms, 4,816 ops/s) with 8 specialist LangGraph agents, 3-way PO/Invoice reconciliation, zero-overhead circuit breakers, and 5-table state persistence.",
    topic_id: "topic-fde",
    topic_name: "Forward Deployed Engineering",
    topic_slug: "fde",
    tags: ["Python", "LangGraph", "FastAPI", "PostgreSQL 17", "Redis 7", "Pydantic v2", "PyMuPDF", "Docker"],
    role: "Lead Autonomous Systems Architect",
    duration: "7 months",
    year: "2026 (Built & Verified)",
    stack: ["Python 3.12", "LangGraph", "FastAPI", "PostgreSQL 17 (pgvector)", "Redis 7", "Pydantic v2", "PyMuPDF", "Docker"],
    links: {
      demo: "https://flowpilot.example.com",
      github: "https://github.com/example/flowpilot-orchestrator",
    },
    hero_media: {
      type: "image",
      fallback_url: "/thumbnails/flowpilot-ai.jpg",
      alt: "FlowPilot AI autonomous multi-agent state graph network with high-speed tiered routing and telemetry",
    },
    featured: true,
    display_order: 5,
    status: "published",
    blocks: [
      {
        type: "rich_text",
        title: "01 / The Multi-Agent Scaling Crisis: LLM Waste on Deterministic Tasks",
        content: `
          <p>Enterprise document processing pipelines (accounts payable, bills of lading, procurement contracts, customs filings) are buckling under naive multi-agent architectures. Most popular agent frameworks route <em>every single subtask</em>—from parsing a date format to matching a 6-digit PO number—through an LLM prompt. This results in severe systemic failures:</p>
          <ul>
            <li><strong>Severe Latency & Cost Inefficiencies:</strong> Invoking an LLM to perform basic arithmetic or line-item tax recalculation costs $0.03 and 2.5 seconds per field. For an enterprise processing 50,000 documents daily, this burns $45,000/month on operations that should take microseconds.</li>
            <li><strong>Catastrophic Floating Point Errors:</strong> Generative models frequently hallucinate subtle discrepancies when summing floating-point line-item totals across multi-page invoices.</li>
            <li><strong>State Loss during Distributed Node Restarts:</strong> In-memory agent state graphs crash during cloud pod redeployments, leaving half-reconciled financial documents in unrecoverable limbo.</li>
          </ul>
          <p>FlowPilot AI was engineered with an uncompromised systems-first philosophy: a Tiered Architecture where deterministic computation handles 70% of workloads at sub-millisecond speeds, reserving LLM reasoning only for genuine semantic edge cases.</p>
        `,
      },
      {
        type: "stats",
        title: "Live Subsystem Benchmarks (PostgreSQL 17 & Redis 7)",
        stats: [
          { label: "Tier-0 Fast Path", value: "0.15 ms", detail: "4,816 ops/sec at zero LLM cost" },
          { label: "Guardrails Overhead", value: "0.01 ms", detail: "5,677 ops/sec zero-latency circuit breakers" },
          { label: "PDF Ingestion Throughput", value: "2.49 ms", detail: "282 documents/sec with PyMuPDF parser" },
          { label: "Concurrent API Throughput", value: "78.2 req/s", detail: "Sustained throughput under peak concurrency" },
          { label: "State Reliability", value: "100% Resumable", detail: "5-table LangGraph checkpointing on Postgres 17" },
        ],
      },
      {
        type: "architecture",
        title: "Tiered Autonomous Agent State Graph (LangGraph)",
        diagram: `flowchart TD
    subgraph Ingestion ["Stage 1: High-Speed Ingestion & Parsing"]
        DocStream["Incoming PDF / Scan Stream"] --> PyMuPDFEngine["PyMuPDF Structure Parser (2.49ms)"]
        PyMuPDFEngine --> FastPath{"Tier-0 Fast Path (0.15ms)<br/>Regex / Date / Math Valid?"}
    end

    subgraph FastTrack ["Deterministic Fast Path (4,816 ops/s)"]
        FastPath -->|"100% Deterministic Match"| InstantApproval["Instant ERP Posting & Audit Record"]
    end

    subgraph AgentGraph ["Stage 2: 8 Specialist LangGraph Agents (LangGraph Graph)"]
        FastPath -->|"Discrepancy / Ambiguity"| SupervisorAgent["Supervisor Router Agent"]
        SupervisorAgent --> ClassificationAgent["Document Classification Agent"]
        SupervisorAgent --> VendorResolverAgent["Vendor Entity Resolver Agent"]
        SupervisorAgent --> ReconciliationAgent["3-Way PO/Invoice Diffing Agent"]
        SupervisorAgent --> DiscrepancyAgent["Discrepancy & Fraud Detector"]
        SupervisorAgent --> ComplianceAgent["Tax & Regulatory Compliance Agent"]
        SupervisorAgent --> HITLAgent["Human-in-the-Loop Routing Agent"]
        SupervisorAgent --> WebhookAgent["ERP Dispatcher Agent"]
        SupervisorAgent --> AuditLoggerAgent["Cryptographic Audit Trail Agent"]
    end

    subgraph ResilienceAndState ["Persistence & Safety Guardrails"]
        CircuitBreaker["Zero-Overhead Guardrails (0.01ms Budget Ceiling)"]
        PostgresCheckpoints[("PostgreSQL 17 State Checkpointer (5 Tables)")]
    end

    SupervisorAgent <--> CircuitBreaker
    SupervisorAgent <--> PostgresCheckpoints
    InstantApproval --> PostgresCheckpoints`,
      },
      {
        type: "rich_text",
        title: "02 / The Tier-0 Fast Path & Pydantic v2 3-Way Reconciliation",
        content: `
          <p>The core architectural breakthrough in FlowPilot AI is the separation of ingestion into strictly ordered execution tiers:</p>
          <ol>
            <li><strong>Tier-0 Deterministic Fast Path (0.15ms):</strong> Built using compiled regular expressions, date normalizers, and fixed-point Decimal arithmetic in Pydantic v2. Clean documents that match existing purchase orders and warehouse receiving receipts are validated and posted to the ERP in 0.15ms at 4,816 operations/second—costing exactly $0.00 in LLM inference.</li>
            <li><strong>Tier-1 Structure-Aware Chunking (2.49ms):</strong> PyMuPDF extracts bounding-box line items directly from PDF byte streams at 282 documents/second, preserving tabular geometry without OCR hallucination.</li>
            <li><strong>Tier-2 LangGraph 8-Agent Graph:</strong> When an invoice exhibits discrepancies (e.g. price variance exceeding 2%, missing bill-of-lading confirmation, or unfamiliar vendor remit address), the Supervisor Agent activates specialist agents to negotiate resolutions or route directly to a human approver.</li>
          </ol>
        `,
      },
      {
        type: "code",
        title: "Pydantic v2 Deterministic 3-Way Diffing Engine",
        language: "python",
        code: `from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field

class LineItem(BaseModel):
    item_code: str
    description: str
    quantity: Decimal
    unit_price: Decimal
    total_amount: Decimal

class InvoiceReconciliationResult(BaseModel):
    is_matched: bool
    variance_amount: Decimal
    discrepancies: List[str] = Field(default_factory=list)

def reconcile_three_way(po_items: List[LineItem], receiving_items: List[LineItem], invoice_items: List[LineItem], tolerance: Decimal = Decimal("0.01")) -> InvoiceReconciliationResult:
    """Tier-0 Fast Path: 0.15ms non-LLM deterministic 3-way reconciliation"""
    discrepancies = []
    total_variance = Decimal("0.00")
    
    po_map = {item.item_code: item for item in po_items}
    rcv_map = {item.item_code: item for item in receiving_items}
    
    for inv in invoice_items:
        po = po_map.get(inv.item_code)
        rcv = rcv_map.get(inv.item_code)
        
        if not po:
            discrepancies.append(f"Item {inv.item_code} on invoice not found in Purchase Order")
            continue
        if not rcv:
            discrepancies.append(f"Item {inv.item_code} billed but not recorded at receiving dock")
            continue
            
        # Verify physical quantity received vs billed
        if inv.quantity > rcv.quantity:
            discrepancies.append(f"Item {inv.item_code}: Billed qty ({inv.quantity}) exceeds received qty ({rcv.quantity})")
            
        # Verify price variance against PO contract ceiling
        price_diff = abs(inv.unit_price - po.unit_price)
        if price_diff > tolerance:
            discrepancies.append(f"Item {inv.item_code}: Unit price variance \${price_diff} exceeds allowable \${tolerance}")
            total_variance += price_diff * inv.quantity
            
    return InvoiceReconciliationResult(
        is_matched=len(discrepancies) == 0,
        variance_amount=total_variance,
        discrepancies=discrepancies
    )`,
      },
      {
        type: "architecture",
        title: "LangGraph 5-Table State Persistence & Execution Engine",
        diagram: `erDiagram
    CHECKPOINTS ||--|{ CHECKPOINT_WRITES : records
    CHECKPOINTS ||--|{ CHECKPOINT_BLOBS : stores
    CHECKPOINTS ||--|| CHECKPOINT_MIGRATIONS : tracks

    CHECKPOINTS {
        text thread_id PK
        text checkpoint_ns PK
        text checkpoint_id PK
        text parent_checkpoint_id
        text type
        jsonb checkpoint_state
        jsonb metadata
    }
    CHECKPOINT_BLOBS {
        text thread_id PK
        text checkpoint_ns PK
        text channel PK
        text version PK
        text type
        blob data
    }
    CHECKPOINT_WRITES {
        text thread_id PK
        text checkpoint_ns PK
        text checkpoint_id PK
        text task_id PK
        int idx PK
        text channel
        text type
        blob data
    }`,
      },
      {
        type: "rich_text",
        title: "03 / Benchmarked Performance & Zero-Downtime Resilience",
        content: `
          <p>FlowPilot AI was subjected to rigorous end-to-end benchmarking on a live PostgreSQL 17 and Redis 7 infrastructure stack:</p>
          <ul>
            <li><strong>78.2 Concurrent Requests / Second:</strong> Sustained end-to-end throughput under peak load, backed by an asynchronous FastAPI gateway and thread-pooled LangGraph execution nodes.</li>
            <li><strong>0.01ms Zero-Overhead Guardrails:</strong> Enforced strict token budget ceilings, maximum loop step limiters (ceiling of 15 steps), and circuit breakers running at 5,677 ops/second to prevent runaway agent loops.</li>
            <li><strong>100% Resumable Agent Workflows:</strong> All agent state transitions are checkpointed across 5 relational PostgreSQL tables. In chaos-testing simulations where worker pods were forcibly terminated mid-execution, the agent cluster resumed workflow execution within 14ms without a single dropped invoice.</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: "cs-aetherfall",
    slug: "aetherfall-aerial-combat",
    title: "Aetherfall: High-Performance Flight Physics & Atmospheric Engine",
    outcome: "Delivered 120 FPS deterministic aerodynamics and custom volumetric cloud shading on PC & console.",
    summary: "A AAA-grade aerial combat simulator built in Unity with Burst Compiler, C# Job System, and compute shader atmospheric scattering.",
    topic_id: "topic-game",
    topic_name: "Game Development",
    topic_slug: "game",
    tags: ["Unity", "C#", "DOTS / Burst", "HLSL Compute", "Custom Physics"],
    role: "Lead Systems & Graphics Architect",
    duration: "14 months",
    year: "2024",
    stack: ["Unity 6", "C#", "HLSL", "DirectX 12", "FMOD Studio"],
    links: {
      demo: "https://example.com/aetherfall-demo",
      github: "https://github.com/example/aetherfall-physics",
    },
    hero_media: {
      type: "image",
      fallback_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
      alt: "Aetherfall fighter aircraft cruising through procedural volumetric cloudscape",
    },
    featured: false,
    display_order: 6,
    status: "published",
    blocks: [
      {
        type: "rich_text",
        title: "01 / The Challenge & Constraints",
        content: "<p>Simulating real-time lift, drag polar equations, and supersonic shockwaves at 120 FPS with zero GC allocations.</p>",
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
    end`,
      },
    ],
  },
  {
    id: "cs-vanguard",
    slug: "vanguard-enterprise-fde-rollout",
    title: "Vanguard: Enterprise On-Premises Core Platform Rollout",
    outcome: "Led high-stakes customer-site deployment of a real-time data engine in air-gapped financial VPCs, cutting client integration time from 3 months to 9 days.",
    summary: "As Lead Forward Deployed Engineer (FDE), architected custom ingestion adapters and air-gapped Helm deployments for a Tier-1 financial institution.",
    topic_id: "topic-fde",
    topic_name: "Forward Deployed Engineering",
    topic_slug: "fde",
    tags: ["Forward Deployed", "FDE", "Go", "Kubernetes", "Air-Gapped", "Terraform", "Kafka"],
    role: "Lead Forward Deployed Engineer (FDE)",
    duration: "7 months",
    year: "2024",
    stack: ["Go 1.22", "Kubernetes", "Helm", "AWS PrivateLink", "Kafka", "Postgres", "Docker"],
    links: {},
    hero_media: {
      type: "image",
      fallback_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      alt: "Vanguard enterprise customer architecture topology",
    },
    featured: false,
    display_order: 7,
    status: "published",
    blocks: [],
  },
  {
    id: "cs-stratus",
    slug: "stratus-multiregion-cloud-infra",
    title: "Stratus: Multi-Region Active-Active Cloud Mesh & Disaster Recovery",
    outcome: "Engineered multi-region active-active cloud infrastructure across AWS and GCP with 99.995% uptime and sub-minute disaster recovery failover.",
    summary: "Architected a dual-cloud multi-region Kubernetes platform with Cilium eBPF mesh and automated Terraform provisioning.",
    topic_id: "topic-cloud",
    topic_name: "Cloud Infrastructure",
    topic_slug: "cloud-infra",
    tags: ["Cloud Infra", "Kubernetes", "AWS", "GCP", "Terraform", "eBPF", "Neon Postgres"],
    role: "Principal Cloud Platform Architect",
    duration: "11 months",
    year: "2024",
    stack: ["AWS", "Google Cloud", "Kubernetes", "Terraform", "Cilium eBPF", "Envoy", "Neon Postgres", "ArgoCD"],
    links: {},
    hero_media: {
      type: "image",
      fallback_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      alt: "Stratus global multi-region cloud mesh topology",
    },
    featured: false,
    display_order: 8,
    status: "published",
    blocks: [],
  },
];

export const FALLBACK_SETTINGS: Record<string, any> = {
  hero_headline: "Engineering spatial systems, high-scale cloud platforms & agentic AI architectures.",
  hero_intro: "Bridging low-level systems engineering with obsessive interactive polish. Specializing in real-time simulation engines, military-grade spatial systems, and high-throughput agentic RAG architectures benchmarked for sub-millisecond execution.",
  about_story: "I am a Lead Systems, Spatial & AI Architect. Over the past 8+ years, I have architected mission-critical real-time platforms—from low-latency VR forensic simulators for military police and cloud-streamed disaster response systems for international development agencies (GIZ), to sub-50ms biometric matchers and enterprise hybrid agentic RAG engines.\\n\\nMy engineering philosophy: performance is never an afterthought—it is the foundational prerequisite for trust, scale, and user delight.",
  contact_email: "fahad@northfold-portfolio.dev",
  cv_url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing",
  social_github: "https://github.com/FahadAkash",
  social_linkedin: "https://linkedin.com",
  social_twitter: "https://x.com",
  skills_list: [
    "ASP.NET Core / C#",
    "Go (Zero-CGO)",
    "Python / LangGraph / PyTorch",
    "Unity 3D / VR / OpenXR",
    "AWS (ECS, S3, CloudFront, Lambda)",
    "Google Cloud (GKE, GCE)",
    "PostgreSQL 17 / pgvector / RLS",
    "Redis 7 / SignalR",
    "Docker / Kubernetes",
    "TypeScript / Next.js",
  ],
};

export const FALLBACK_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "What types of engineering projects do you specialize in?",
    answer: "I specialize in high-concurrency systems, immersive spatial simulation (Unity/VR), cloud-streamed digital twins, sovereign biometric algorithms, and enterprise AI agent orchestration (LangGraph, pgvector, hybrid RAG).",
    group_name: "Engagements",
    display_order: 1,
  },
  {
    id: "faq-2",
    question: "How do you handle client confidentiality, military compliance, and NDAs?",
    answer: "I work regularly with sovereign defense, international development organizations (GIZ), and enterprise clients. All proprietary algorithms, private cryptographic keys, and sensitive architectural schemas are protected under rigorous security protocols, with public case studies strictly adhering to sanitized, non-NDA technical principles.",
    group_name: "Security & NDAs",
    display_order: 2,
  },
  {
    id: "faq-3",
    question: "Can your systems run in air-gapped or on-premises enterprise environments?",
    answer: "Yes. Projects like the Forensic AFIS and Lexora AI are engineered to run completely air-gapped without external cloud API dependencies, utilizing local open-weights LLMs (Gemma 4 12B), SQLite WAL, and self-hosted vector stores.",
    group_name: "Architecture",
    display_order: 3,
  },
];
