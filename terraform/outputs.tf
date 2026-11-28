output "telemetry_bucket" {
  description = "The bucket the laptop syncs Claude Code telemetry and sessions to."
  value       = google_storage_bucket.telemetry.url
}

output "reader_service_account" {
  description = "The service account cloud sessions use to read the telemetry bucket."
  value       = google_service_account.reader.email
}
