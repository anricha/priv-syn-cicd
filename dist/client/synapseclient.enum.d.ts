export { ArtifactType, TokenAudience, TriggerActivationState };
declare enum ArtifactType {
    Pipeline = "pipelines",
    Dataflow = "dataflows",
    Dataset = "datasets",
    Trigger = "triggers",
    LinkedService = "linkedservices",
    SQLScript = "sqlScripts",
    Notebook = "notebooks",
    SparkJobDefinition = "sparkJobDefinitions",
    BigDataPool = "bigDataPools",
    Unknown = "unknown"
}
declare enum TokenAudience {
    Synapse = "https://dev.azuresynapse.net/"
}
declare enum TriggerActivationState {
    Started = "Started",
    Stopped = "Stopped",
    Disabled = "Disabled"
}
