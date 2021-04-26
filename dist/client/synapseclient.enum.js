"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerActivationState = exports.TokenAudience = exports.ArtifactType = void 0;
var ArtifactType;
(function (ArtifactType) {
    ArtifactType["Pipeline"] = "pipelines";
    ArtifactType["Dataflow"] = "dataflows";
    ArtifactType["Dataset"] = "datasets";
    ArtifactType["Trigger"] = "triggers";
    ArtifactType["LinkedService"] = "linkedservices";
    ArtifactType["SQLScript"] = "sqlScripts";
    ArtifactType["Notebook"] = "notebooks";
    ArtifactType["SparkJobDefinition"] = "sparkJobDefinitions";
    ArtifactType["BigDataPool"] = "bigDataPools";
    ArtifactType["Unknown"] = "unknown";
})(ArtifactType || (ArtifactType = {}));
exports.ArtifactType = ArtifactType;
var TokenAudience;
(function (TokenAudience) {
    TokenAudience["Synapse"] = "https://dev.azuresynapse.net/";
})(TokenAudience || (TokenAudience = {}));
exports.TokenAudience = TokenAudience;
var TriggerActivationState;
(function (TriggerActivationState) {
    TriggerActivationState["Started"] = "Started";
    TriggerActivationState["Stopped"] = "Stopped";
    TriggerActivationState["Disabled"] = "Disabled";
})(TriggerActivationState || (TriggerActivationState = {}));
exports.TriggerActivationState = TriggerActivationState;
//# sourceMappingURL=synapseclient.enum.js.map