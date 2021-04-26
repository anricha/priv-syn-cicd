export { ArtifactType, TokenAudience, TriggerActivationState };

enum ArtifactType {
    Pipeline = "pipelines",
    Dataflow = "dataflows",
    Dataset = "datasets",
    Trigger = "triggers",
    LinkedService = "linkedservices",
    SQLScript = "sqlScripts",
    Notebook = "notebooks",
    SparkJobDefinition = "sparkJobDefinitions",
    BigDataPool = "bigDataPools",
    Unknown = "unknown",
}

enum TokenAudience {
    Synapse = "https://dev.azuresynapse.net/",
}

enum TriggerActivationState {
    Started = "Started",
    Stopped = "Stopped",
    Disabled = "Disabled",
}
