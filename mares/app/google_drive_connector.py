import os
from google.adk.tools.application_integration_tool.application_integration_toolset import (
    ApplicationIntegrationToolset,
)

GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")
GCP_LOCATION = os.getenv("GCP_LOCATION", "europe-west1")

google_drive_toolset = ApplicationIntegrationToolset(
    project=GCP_PROJECT_ID,
    location=GCP_LOCATION,
    connection="google-drive-connector",
    entity_operations={
        "Docs": [],
        "Drives": [],
        "Files": [],
        "Folders": [],
    },
    actions=["CreateFolder"],
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
