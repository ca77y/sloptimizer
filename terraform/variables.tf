variable "project_id" {
  description = "The GCP project that holds the Claude Code telemetry."
  type        = string
  default     = "sloptimizer-472320"
}

variable "billing_account" {
  description = "The billing account linked to the project, set in the ignored terraform.tfvars."
  type        = string
}

variable "region" {
  description = "Where the data lives."
  type        = string
  default     = "europe-central2"
}
