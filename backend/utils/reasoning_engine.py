import re
from typing import Dict, Any, List

class InfrastructureReasoningEngine:
    """
    Deterministic Infrastructure Reasoning Engine for ArchGen.
    Eliminates template fallbacks and direct AI-hallucinated structural topologies.
    """

    WORKLOAD_TYPES = [
        "ott",
        "banking",
        "ecommerce",
        "ai_platform",
        "saas_platform",
        "gaming_backend",
        "crud",
        "analytics",
        "microservices"
    ]

    def __init__(self, cloud_provider: str = "azure"):
        self.cloud_provider = cloud_provider.lower()

    def classify_workload(self, app_description: str, expected_users: str) -> str:
        """
        Classifies the workload based on keywords and description patterns.
        """
        desc = app_description.lower()
        users = expected_users.lower()

        # Check banking / fintech
        if any(w in desc for w in ["bank", "fintech", "payment", "transaction", "ledger", "pci", "banking", "finance"]):
            return "banking"
        
        # Check OTT / Streaming
        if any(w in desc for w in ["ott", "streaming", "video", "broadcast", "live", "media", "netflix", "youtube", "audio"]):
            return "ott"
        
        # Check AI Platform
        if any(w in desc for w in ["ai", "ml", "gpu", "llm", "deep learning", "inference", "training", "model", "openai", "gpt"]):
            return "ai_platform"
        
        # Check E-commerce
        if any(w in desc for w in ["ecommerce", "e-commerce", "shop", "retail", "cart", "store", "product catalog", "checkout"]):
            return "ecommerce"
        
        # Check SaaS Platform
        if any(w in desc for w in ["saas", "multi-tenant", "b2b saas", "subscription portal", "tenant"]):
            return "saas_platform"
        
        # Check Gaming Backend
        if any(w in desc for w in ["game", "gaming", "multiplayer", "matchmaking", "lobby", "leaderboard", "unreal", "unity"]):
            return "gaming_backend"
        
        # Check Analytics / Big Data
        if any(w in desc for w in ["analytics", "big data", "data warehouse", "lakehouse", "spark", "hadoop", "bi tool", "dashboard", "telemetry"]):
            return "analytics"
        
        # Check Microservices
        if any(w in desc for w in ["microservices", "kubernetes", "aks", "eks", "gke", "service mesh", "istio", "event-driven"]):
            return "microservices"
        
        # Check if explicitly tiny / simple -> CRUD
        if any(w in desc for w in ["simple", "crud", "basic", "portfolio", "hobby", "internal tool", "small database"]):
            return "crud"
        
        # Default fallback classification based on scale or generic text
        if "million" in users or "100k" in users or "100,000" in users:
            return "saas_platform"
        
        return "crud"

    def get_cloud_resource_name(self, generic_type: str) -> str:
        """
        Maps generic architectural components to provider-specific names.
        """
        mapping = {
            "azure": {
                "gateway": "Azure Front Door & WAF Ingress",
                "cdn": "Azure CDN (Edge Content Delivery)",
                "frontend": "Azure Static Web App (SPA)",
                "compute_basic": "Azure App Service",
                "compute_container": "Azure Container App",
                "compute_k8s": "Azure Kubernetes Service (AKS)",
                "database_relational": "Azure Database for PostgreSQL (Flexible)",
                "database_nosql": "Azure Cosmos DB (NoSQL)",
                "cache": "Azure Cache for Redis (HA)",
                "storage": "Azure Storage Account (Hot Blobs)",
                "vault": "Azure Key Vault (HSM Secrets)",
                "monitoring": "Azure Log Analytics & App Insights",
                "ddos": "Azure DDoS Protection Plan",
                "vnet": "Azure Virtual Network (Private Subnets)"
            },
            "aws": {
                "gateway": "AWS Application Load Balancer & WAF",
                "cdn": "Amazon CloudFront CDN",
                "frontend": "AWS Amplify Static Hosting / S3",
                "compute_basic": "AWS Elastic Beanstalk",
                "compute_container": "AWS ECS Fargate Container",
                "compute_k8s": "Amazon EKS Cluster",
                "database_relational": "Amazon RDS PostgreSQL (Multi-AZ)",
                "database_nosql": "Amazon DynamoDB",
                "cache": "Amazon ElastiCache Redis",
                "storage": "Amazon S3 Bucket",
                "vault": "AWS Secrets Manager / KMS",
                "monitoring": "Amazon CloudWatch & X-Ray",
                "ddos": "AWS Shield Advanced",
                "vnet": "AWS VPC (Private & Public Subnets)"
            },
            "gcp": {
                "gateway": "Google Cloud Load Balancing & Cloud Armor WAF",
                "cdn": "Google Cloud CDN",
                "frontend": "Firebase Hosting",
                "compute_basic": "Google Cloud Run",
                "compute_container": "Google Cloud Run Container",
                "compute_k8s": "Google Kubernetes Engine (GKE)",
                "database_relational": "Google Cloud SQL PostgreSQL",
                "database_nosql": "Google Cloud Firestore",
                "cache": "Google Cloud Memorystore Redis",
                "storage": "Google Cloud Storage Bucket",
                "vault": "Google Secret Manager",
                "monitoring": "Google Cloud Operations Suite (Stackdriver)",
                "ddos": "Google Cloud Armor Enterprise",
                "vnet": "Google VPC Network"
            }
        }
        
        provider_map = mapping.get(self.cloud_provider, mapping["azure"])
        return provider_map.get(generic_type, generic_type)

    def plan_topology(self, workload: str, budget: float) -> Dict[str, Any]:
        """
        Deterministic architecture layout synthesis.
        Translates workload class and budget directly into nodes, edges, and service listings.
        """
        nodes = []
        edges = []
        services = []

        # Step 1: Infer resource rules
        requires_cdn = False
        requires_cache = False
        requires_storage = False
        requires_security = False
        requires_monitoring = False
        requires_vnet = False
        requires_ddos = False
        
        db_type = "database_relational" # default
        compute_type = "compute_container" # default

        # Apply specific rules
        if workload == "ott":
            requires_cdn = True
            requires_storage = True
            requires_cache = True
            requires_monitoring = True
            compute_type = "compute_container"
            db_type = "database_nosql"
        elif workload == "banking":
            requires_security = True
            requires_monitoring = True
            requires_vnet = True
            requires_ddos = True
            compute_type = "compute_container"
            db_type = "database_relational"
        elif workload == "crud":
            requires_cdn = False
            requires_cache = False
            requires_storage = False
            requires_security = False
            requires_monitoring = False
            requires_vnet = False
            # Small CRUD avoids Kubernetes and Redis unless high budget
            compute_type = "compute_basic"
            db_type = "database_relational"
        elif workload == "ecommerce":
            requires_cdn = True
            requires_cache = True
            requires_storage = True
            requires_security = True
            requires_monitoring = True
            compute_type = "compute_container"
            db_type = "database_relational"
        elif workload == "ai_platform":
            requires_storage = True
            requires_cache = True
            requires_security = True
            requires_monitoring = True
            compute_type = "compute_container"
            db_type = "database_nosql"
        elif workload == "saas_platform" or workload == "microservices":
            requires_cdn = True
            requires_cache = True
            requires_storage = True
            requires_security = True
            requires_monitoring = True
            requires_vnet = True
            if budget >= 1000:
                compute_type = "compute_k8s"
            else:
                compute_type = "compute_container"
            db_type = "database_relational"
        else: # defaults
            requires_storage = True
            requires_cache = True
            compute_type = "compute_container"
            db_type = "database_relational"

        # Step 2: Define active service list
        # We always want a Gateway / WAF layer if security/ddos or complex workloads
        gateway_title = self.get_cloud_resource_name("gateway")
        frontend_title = self.get_cloud_resource_name("frontend")
        compute_title = self.get_cloud_resource_name("compute_k8s" if compute_type == "compute_k8s" else ("compute_container" if compute_type == "compute_container" else "compute_basic"))
        db_title = self.get_cloud_resource_name(db_type)

        # Dynamic Coordinates Builder (Deterministic Positions)
        # Avoid static overlays. Clean layered design:
        # X range: 80 - 600
        # Y range: 100 - 450
        
        # Node generation
        # 1. Gateway / Ingress
        nodes.append({
            "id": "gateway-node",
            "type": "GatewayNode",
            "data": {"label": gateway_title, "status": "active", "typeSubText": "Global Routing"},
            "position": {"x": 80, "y": 200}
        })
        services.append({
            "name": gateway_title,
            "category": "gateway",
            "description": f"Public entry point, SSL termination, and threat prevention filtering traffic into the infrastructure."
        })

        # 2. DDoS protection (If Banking/High scale)
        if requires_ddos:
            nodes.append({
                "id": "ddos-node",
                "type": "SecurityNode",
                "data": {"label": self.get_cloud_resource_name("ddos"), "status": "active", "typeSubText": "DDoS Shield"},
                "position": {"x": 80, "y": 80}
            })
            services.append({
                "name": self.get_cloud_resource_name("ddos"),
                "category": "security",
                "description": "Layer 3/4 continuous mitigation for volumetric network floods."
            })
            edges.append({"id": "e-ddos-gateway", "source": "ddos-node", "target": "gateway-node", "animated": True})

        # 3. CDN (If OTT/Ecomm/High media scale)
        if requires_cdn:
            nodes.append({
                "id": "cdn-node",
                "type": "GatewayNode",
                "data": {"label": self.get_cloud_resource_name("cdn"), "status": "active", "typeSubText": "Edge Content Delivery"},
                "position": {"x": 200, "y": 80}
            })
            services.append({
                "name": self.get_cloud_resource_name("cdn"),
                "category": "gateway",
                "description": "Caches static assets at global edge locations for optimized load performance."
            })
            edges.append({"id": "e-cdn-frontend", "source": "cdn-node", "target": "frontend-node", "animated": True})

        # 4. Frontend Web App
        nodes.append({
            "id": "frontend-node",
            "type": "FrontendNode",
            "data": {"label": frontend_title, "status": "active", "typeSubText": "Static SPA Web App"},
            "position": {"x": 260, "y": 100}
        })
        services.append({
            "name": frontend_title,
            "category": "frontend",
            "description": "Hosts optimized single page application web builds (React, Next.js, HTML5/JS)."
        })
        edges.append({"id": "e-gateway-frontend", "source": "gateway-node", "target": "frontend-node", "animated": True})

        # 5. Compute API Backend
        nodes.append({
            "id": "backend-node",
            "type": "BackendNode",
            "data": {"label": compute_title, "status": "active", "typeSubText": "Server Compute"},
            "position": {"x": 260, "y": 240}
        })
        services.append({
            "name": compute_title,
            "category": "backend",
            "description": "Autoscaling back-end compute environment hosting API servers and docker container logic."
        })
        edges.append({"id": "e-gateway-backend", "source": "gateway-node", "target": "backend-node", "animated": True})
        edges.append({"id": "e-frontend-backend", "source": "frontend-node", "target": "backend-node", "animated": False})

        # 6. Primary Database Node
        nodes.append({
            "id": "database-node",
            "type": "DatabaseNode",
            "data": {"label": db_title, "status": "active", "typeSubText": "Persistence Layer"},
            "position": {"x": 480, "y": 300}
        })
        services.append({
            "name": db_title,
            "category": "database",
            "description": "Secure primary storage engine supporting indexing, relationships, and transactional queries."
        })
        edges.append({"id": "e-backend-database", "source": "backend-node", "target": "database-node", "animated": False})

        # 7. Redis Cache Layer
        if requires_cache:
            nodes.append({
                "id": "cache-node",
                "type": "CacheNode",
                "data": {"label": self.get_cloud_resource_name("cache"), "status": "active", "typeSubText": "Memory Caching"},
                "position": {"x": 480, "y": 180}
            })
            services.append({
                "name": self.get_cloud_resource_name("cache"),
                "category": "cache",
                "description": "In-memory key-value cache layer optimized for lightning-fast reads and session persistence."
            })
            edges.append({"id": "e-backend-cache", "source": "backend-node", "target": "cache-node", "animated": False})

        # 8. File Storage (Hot blobs/S3)
        if requires_storage:
            nodes.append({
                "id": "storage-node",
                "type": "StorageNode",
                "data": {"label": self.get_cloud_resource_name("storage"), "status": "active", "typeSubText": "Binary Storage"},
                "position": {"x": 260, "y": 380}
            })
            services.append({
                "name": self.get_cloud_resource_name("storage"),
                "category": "storage",
                "description": "Highly scalable unstructured storage for multimedia files, exports, and document assets."
            })
            edges.append({"id": "e-backend-storage", "source": "backend-node", "target": "storage-node", "animated": False})
            if requires_cdn:
                edges.append({"id": "e-cdn-storage", "source": "cdn-node", "target": "storage-node", "animated": True})

        # 9. Key Vault / HSM Secrets (If Banking or High Scale)
        if requires_security:
            nodes.append({
                "id": "vault-node",
                "type": "SecurityNode",
                "data": {"label": self.get_cloud_resource_name("vault"), "status": "active", "typeSubText": "HSM & Secret Vault"},
                "position": {"x": 80, "y": 360}
            })
            services.append({
                "name": self.get_cloud_resource_name("vault"),
                "category": "security",
                "description": "Hardware-backed storage for cryptographic keys, tokens, environment configs, and secrets."
            })
            edges.append({"id": "e-backend-vault", "source": "backend-node", "target": "vault-node", "animated": True})

        # 10. Monitoring layer
        if requires_monitoring:
            nodes.append({
                "id": "monitoring-node",
                "type": "MonitoringNode",
                "data": {"label": self.get_cloud_resource_name("monitoring"), "status": "active", "typeSubText": "Log Analytics"},
                "position": {"x": 420, "y": 420}
            })
            services.append({
                "name": self.get_cloud_resource_name("monitoring"),
                "category": "monitoring",
                "description": "Aggregated application telemetry, performance metrics, and network activity collection."
            })
            edges.append({"id": "e-backend-monitoring", "source": "backend-node", "target": "monitoring-node", "animated": False})

        return {
            "nodes": nodes,
            "edges": edges,
            "services": services
        }
