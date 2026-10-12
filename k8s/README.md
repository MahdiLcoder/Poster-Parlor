# Poster Parlor Kubernetes Deployment Guide

This directory contains the production-ready Kubernetes manifests for **Poster Parlor** (`Next.js` + `NestJS` + `MongoDB`).

## File Manifest Structure

| File | Resource(s) | Description |
|------|-------------|-------------|
| [`kind-config.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/kind-config.yaml) | `Cluster` | Kind cluster definition with port 80/443 port mappings for NGINX Ingress |
| [`namespace.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/namespace.yaml) | `Namespace` | Dedicated `poster-parlor` namespace |
| [`configmap.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/configmap.yaml) | `ConfigMap` | Non-sensitive configurations for API and Web |
| [`secret.example.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/secret.example.yaml) | `Secret` | Sensitive configuration template (DB password, OAuth, JWT, Razorpay) |
| [`mongo.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/mongo.yaml) | `PVC`, `Deployment`, `Service` | Stateful MongoDB 7 deployment with persistent volume and ClusterIP service |
| [`backend.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/backend.yaml) | `Deployment`, `Service` | NestJS backend deployment (2 replicas, zero-downtime rolling update, probes, non-root user `1000`) |
| [`frontend.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/frontend.yaml) | `Deployment`, `Service` | Next.js frontend deployment (2 replicas, zero-downtime rolling update, probes, non-root user `1001`) |
| [`ingress.yaml`](file:///home/ab-mehdi/development/poster-parlor/k8s/ingress.yaml) | `Ingress` | NGINX Ingress controller rules mapping `/api` to backend and `/` to frontend |

---

## Step-by-Step Cluster Setup & Deployment

### 1. Create the kind Cluster
```bash
kind create cluster --name poster-parlor --config k8s/kind-config.yaml
```

### 2. Install NGINX Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

### 3. Load Locally Built Docker Images into kind
```bash
kind load docker-image poster-parlor-api:prod --name poster-parlor
kind load docker-image poster-parlor-web:prod --name poster-parlor
```

### 4. Create Secrets
Copy the example secret and apply:
```bash
cp k8s/secret.example.yaml k8s/secret.yaml
# Edit k8s/secret.yaml if needed, then apply:
kubectl apply -f k8s/secret.yaml
```

### 5. Apply the Application Manifests
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

### 6. Verify Rollout & Health
```bash
kubectl -n poster-parlor get pods
kubectl -n poster-parlor rollout status deployment/api-deployment
kubectl -n poster-parlor rollout status deployment/web-deployment
```

### 7. Access Application
Add to your `/etc/hosts`:
```
127.0.0.1 poster-parlor.local
```
Navigate to:
- Frontend: `http://poster-parlor.local`
- Backend Health: `http://poster-parlor.local/api/v1/db-health`

