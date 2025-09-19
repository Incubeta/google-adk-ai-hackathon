import os
from google.adk.tools.application_integration_tool.application_integration_toolset import (
    ApplicationIntegrationToolset,
)

GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")
GCP_LOCATION = os.getenv("GCP_LOCATION", "europe-west1")

google_docs_toolset = ApplicationIntegrationToolset(
    project=GCP_PROJECT_ID,
    location=GCP_LOCATION,
    connection="google-docs-connector",
    actions=[
        "GET_v1/documents/%7BdocumentId%7D",
        "POST_v1/documents/%7BdocumentId%7D%3AbatchUpdate",
    ],
)

"""Available Actions:
{
  "actions": [
    {
      "action": "GET_v1/documents/%7BdocumentId%7D",
    },
    {
      "action": "POST_v1/documents/%7BdocumentId%7D%3AbatchUpdate",
    }
  ]
}
"""
