# Google Cloud deployment (single repository, three Cloud Run services)

This is a hackathon demo deployment recipe. It keeps all source in one repository and deploys the API, worker UI, and admin UI as three services. It does **not** claim production readiness.

## Before deploying

- Install Google Cloud CLI, sign in, select a project, and enable billing.
- Enable Cloud Run, Cloud Build, and Artifact Registry APIs.
- Choose a region and set `PROJECT_ID` and `REGION` in your terminal.
- Do not commit `.env`, secrets, or real worker data.

```bash
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

## Deploy API first

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/fairshift-api -f Dockerfile.api .
gcloud run deploy fairshift-api --image gcr.io/PROJECT_ID/fairshift-api --region REGION --allow-unauthenticated --port 4000 --set-env-vars AI_MODE=mock,DEMO_MODE=1,SERVER_SECRET=REPLACE_WITH_LONG_RANDOM_SECRET
```

Copy the service URL from the output. Check `<API_URL>/api/health`.

## Deploy worker and admin UIs

Replace `API_URL` with the deployed API service URL (no trailing slash).

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/fairshift-worker -f Dockerfile.frontend --build-arg APP=worker .
gcloud run deploy fairshift-worker --image gcr.io/PROJECT_ID/fairshift-worker --region REGION --allow-unauthenticated --port 8080 --set-env-vars FAIRSHIFT_API_URL=API_URL

gcloud builds submit --tag gcr.io/PROJECT_ID/fairshift-admin -f Dockerfile.frontend --build-arg APP=admin .
gcloud run deploy fairshift-admin --image gcr.io/PROJECT_ID/fairshift-admin --region REGION --allow-unauthenticated --port 8080 --set-env-vars FAIRSHIFT_API_URL=API_URL
```

The worker and admin URLs are separate Cloud Run service URLs. Use one Git repository for all three images. The `FAIRSHIFT_API_URL` variable is consumed by nginx at container startup.

## Important data persistence and security limitations

The current server uses local SQLite. Cloud Run container filesystems are ephemeral; database contents can be lost during replacement/restart and multiple instances do not share one SQLite database. This configuration is suitable only for a short synthetic-data demonstration. For persistent multi-instance use, migrate the database layer to Cloud SQL for PostgreSQL (or another managed persistent database), implement migrations, configure least-privilege service accounts, store secrets in Secret Manager, set CORS to the exact deployed origins, and turn off demo bypasses only after role-protected flows have been verified. Do not deploy real employee information using the current demo configuration.

## Post-deployment smoke checks

- `GET <API_URL>/api/health` returns `ok: true`.
- Open the worker and admin URLs and check that `/api` requests succeed.
- Submit one synthetic hazard report and verify it appears in the admin console.
- Run the pay-check and ledger-verify actions.
- Check Cloud Run logs for startup errors.

Deployment must be performed by a project owner with access to the target Google Cloud project. This document does not mean that a cloud deployment has already occurred.
