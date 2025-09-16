from google.adk.tools.application_integration_tool.application_integration_toolset import (
    ApplicationIntegrationToolset,
)

google_drive_tool = ApplicationIntegrationToolset(
    project="qwiklabs-gcp-02-fdeb79e5d8e5",
    location="eu-west1",  # TODO: replace with location of the connection
    connection="google-drive-connector",  # TODO: replace with connection name
    entity_operations={
        "Docs": [],
        "Drives": [],
        "Files": [],
        "Folders": [],
    },
    actions=["CreateFolder"],
    service_account_json="{...}",  # optional. Stringified json for service account key
    tool_name_prefix="tool_prefix2",
    tool_instructions="...",
)

"""Available Actions:
{
  "actions": [
    {
      "action": "CopyResource",
      "displayName": "CopyResource"
    },
    {
      "action": "CreateFolder",
      "displayName": "CreateFolder"
    },
    {
      "action": "DeleteResource",
      "displayName": "DeleteResource"
    },
    {
      "action": "DownloadFile",
      "displayName": "DownloadFile"
    },
    {
      "action": "EmptyTrash",
      "displayName": "EmptyTrash"
    },
    {
      "action": "GetAuthenticatedUserInfo",
      "displayName": "GetAuthenticatedUserInfo"
    },
    {
      "action": "MoveResource",
      "displayName": "MoveResource"
    },
    {
      "action": "MoveToTrash",
      "displayName": "MoveToTrash"
    },
    {
      "action": "RestoreFromTrash",
      "displayName": "RestoreFromTrash"
    },
    {
      "action": "SetDriveVisibility",
      "displayName": "SetDriveVisibility"
    },
    {
      "action": "StopWatchingResources",
      "displayName": "StopWatchingResources"
    },
    {
      "action": "SubscribeToFileChanges",
      "displayName": "SubscribeToFileChanges"
    },
    {
      "action": "SubscribeToUserChanges",
      "displayName": "SubscribeToUserChanges"
    },
    {
      "action": "UpdateResource",
      "displayName": "UpdateResource"
    },
    {
      "action": "UploadFile",
      "displayName": "UploadFile"
    }
  ]
}
"""
