terraform {
  backend "gcs" {
    bucket = "glo-tech-in-mares-production-terraform-state"
    prefix = "google-adk-ai-hackathon/prod"
  }
}
