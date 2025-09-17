from google.adk.tools.application_integration_tool.application_integration_toolset import (
    ApplicationIntegrationToolset,
)

google_docs_toolset = ApplicationIntegrationToolset(
    project="qwiklabs-gcp-02-fdeb79e5d8e5",
    location="europe-west1",
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
