apiVersion: helm.cattle.io/v1 # Or Helm chart deployment
# Production Monitoring Architecture for Poster Parlor

## 1. Native Kubernetes Diagnostics
Commands to inspect workload health:
```bash
# Cluster-wide status
kubectl get pods -A
kubectl -n poster-parlor get deployments,services,ingress,pvc

# Detailed pod events and container lifecycle
kubectl -n poster-parlor describe pod -l app.kubernetes.io/name=api
kubectl -n poster-parlor describe pod -l app.kubernetes.io/name=web

# Streaming logs
kubectl -n poster-parlor logs -l app.kubernetes.io/name=api --tail=100 -f
kubectl -n poster-parlor logs -l app.kubernetes.io/name=web --tail=100 -f
```

---

## 2. Cluster Metrics (Metrics Server)
To enable `kubectl top pods` and `kubectl top nodes`:

```bash
# Install metrics-server on kind / local Kubernetes:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Patch for local self-signed certificates in kind:
kubectl -n kube-system patch deployment metrics-server --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--kubelet-insecure-tls"}]'
```

Verify resource consumption:
```bash
kubectl top nodes
kubectl -n poster-parlor top pods
```

---

## 3. Prometheus & Grafana Monitoring Stack
Recommended production-grade Helm deployment using `kube-prometheus-stack`:

### Install via Helm
```bash
# Add prometheus-community helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install monitoring stack into dedicated monitoring namespace
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword="admin" \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false
```

### Access Grafana Dashboard
```bash
kubectl -n monitoring port-forward svc/monitoring-grafana 3001:80
```
- URL: `http://localhost:3001`
- User: `admin` / Password: `admin`

---

## 4. Key Production Alerts Recommended

| Alert Rule | Condition | Severity | Action |
|------------|-----------|----------|--------|
| **PodCrashLooping** | `rate(kube_pod_container_status_restarts_total[5m]) > 0` | Critical | Inspect `kubectl logs --previous` |
| **ApiHighErrorRate** | `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05` | Warning | Check NestJS application logs |
| **HighMemoryPressure** | `container_memory_working_set_bytes / container_spec_memory_limit_bytes > 0.85` | Warning | Scale replicas or increase container memory limit |
| **MongoDiskSpaceLow** | `kubelet_volume_stats_available_bytes{persistentvolumeclaim="mongo-pvc"} / kubelet_volume_stats_capacity_bytes < 0.15` | Critical | Expand PersistentVolume storage |

---

## 5. MongoDB Backup and Disaster Recovery Procedure

### Automated Scheduled Backup (Kubernetes CronJob)
A lightweight CronJob runs `mongodump` into an archive and persists it to external S3/Cloud Storage:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: mongo-backup
  namespace: poster-parlor
spec:
  schedule: "0 2 * * *" # Daily at 2:00 AM UTC
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: mongodump
              image: mongo:7
              command:
                - /bin/sh
                - -c
                - >
                  mongodump --host=mongo-service:27017
                  --username=$MONGO_INITDB_ROOT_USERNAME
                  --password=$MONGO_INITDB_ROOT_PASSWORD
                  --authenticationDatabase=admin
                  --db=$MONGO_INITDB_DATABASE
                  --archive=/backup/mongo-$(date +%Y%m%d_%H%M%S).gz --gzip
              envFrom:
                - secretRef:
                    name: mongo-secret
              volumeMounts:
                - name: backup-volume
                  mountPath: /backup
          restartPolicy: OnFailure
          volumes:
            - name: backup-volume
              persistentVolumeClaim:
                claimName: mongo-backup-pvc
```

