# Telemetry

How Claude Code's telemetry and session transcripts get from the laptop to GCP, where cloud sessions read them to
study how the plugins behave.

## Flow

1. Claude Code exports OpenTelemetry logs and metrics over OTLP to `127.0.0.1:4317`.
2. A local OpenTelemetry Collector, [`telemetry/collector.yaml`](../telemetry/collector.yaml), writes them as JSON
   lines to `~/.claude/otel/logs.jsonl` and `~/.claude/otel/metrics.jsonl`. It rotates them at 50 MB and keeps 30
   days.
3. [`telemetry/sync.sh`](../telemetry/sync.sh) runs at login and every 15 minutes. It copies `~/.claude/otel/` and
   `~/.claude/projects/`, the session transcripts, to `gs://sloptimizer-472320-telemetry/<LocalHostName>/`. It never
   deletes from the bucket.
4. The bucket deletes each object 30 days after upload. The laptop also keeps 30 days, so the sync never re-uploads
   what the bucket has deleted.

## Pieces

- `telemetry/install.sh`: downloads and checksums `otelcol-contrib`, pinned in the script, into
  `~/.local/share/sloptimizer-telemetry/`. It installs the collector config and the sync script there, and loads the
  two launchd agents `com.sloptimizer.otelcol` and `com.sloptimizer.sync` from the plist templates beside it. It is
  safe to rerun, which reinstalls and restarts both. `make telemetry` runs it.
- `terraform/`: the GCP side in project `sloptimizer-472320`, region `europe-central2`. It links the project's billing,
  enables Cloud Storage and IAM, and owns the bucket and the reader service account. The project itself was created with `gcloud projects create`. The state,
  the provider cache and `terraform.tfvars`, which holds `billing_account`, are local and ignored by git.

## Cloud access

claude.ai cloud sessions read the bucket as the service account
`telemetry-reader@sloptimizer-472320.iam.gserviceaccount.com`. It holds only `roles/storage.objectViewer`, granted on
the bucket, so it can list and read objects but cannot write or delete. Terraform owns the account and its grant. Its
JSON key is made with `gcloud`, so the private key stays out of the Terraform state:

```sh
gcloud iam service-accounts keys create ~/.config/sloptimizer/telemetry-reader-key.json \
  --iam-account telemetry-reader@sloptimizer-472320.iam.gserviceaccount.com
```

The key goes into the cloud environment's `GCP_SA_KEY` variable: open the environment menu in the session title bar,
choose Edit, and paste it there. The environment's setup script writes the key to a file and runs
`gcloud auth activate-service-account --key-file <file>`, so each session starts signed in. Environment variables load
when a session starts.

To rotate the key, create a new one, replace `GCP_SA_KEY`, then delete the old one with
`gcloud iam service-accounts keys delete <key id> --iam-account <account>`. List the keys with
`gcloud iam service-accounts keys list --iam-account <account> --managed-by user`.

## Turning it on

1. Sign in once with `gcloud auth login`. The sync runs `gcloud storage` as that account.
2. Run `make telemetry`.
3. Have Claude Code export telemetry. Put this in `env` in `~/.claude/settings.json`:

   ```json
   {
     "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
     "OTEL_METRICS_EXPORTER": "otlp",
     "OTEL_LOGS_EXPORTER": "otlp",
     "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
     "OTEL_EXPORTER_OTLP_ENDPOINT": "http://127.0.0.1:4317"
   }
   ```

## Checking it

- Agents loaded: `launchctl list | grep com.sloptimizer`.
- Logs: `~/Library/Logs/com.sloptimizer.otelcol.log` and `~/Library/Logs/com.sloptimizer.sync.log`. Each sync ends
  with a `synced to` line.
- Data landing: `gcloud storage ls gs://sloptimizer-472320-telemetry/$(scutil --get LocalHostName)/`.

## Turning it off

```sh
launchctl bootout gui/$(id -u)/com.sloptimizer.otelcol
launchctl bootout gui/$(id -u)/com.sloptimizer.sync
rm ~/Library/LaunchAgents/com.sloptimizer.{otelcol,sync}.plist
```

Remove the `env` keys above too, or Claude Code will keep exporting to a port where nothing is listening.

## History

The setup started in the `agentic-claude` repo, against project `agentic-claude-004680`. That project was deleted
along with its bucket, so this setup moved here and runs on a new project, `sloptimizer-472320`. The old data is gone.
