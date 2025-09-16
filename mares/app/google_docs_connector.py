from google.adk.tools.application_integration_tool.application_integration_toolset import (
    ApplicationIntegrationToolset,
)

google_docs_tool = ApplicationIntegrationToolset(
    project="qwiklabs-gcp-02-fdeb79e5d8e5",
    location="eu-west1",
    connection="google-docs-connector",
    entity_operations={},
    actions=[
        "GET_v1/documents/%7BdocumentId%7D",
        "POST_v1/documents/%7BdocumentId%7D%3AbatchUpdate",
    ],
    service_account_json="{...}",  # optional. Stringified json for service account key
    tool_name_prefix="tool_prefix2",
    tool_instructions="...",
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
