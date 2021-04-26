"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureEnvironment = exports.SynapseClient = void 0;
const ms_rest_1 = require("ms-rest");
const ms_rest_azure_1 = require("ms-rest-azure");
Object.defineProperty(exports, "AzureEnvironment", { enumerable: true, get: function () { return ms_rest_azure_1.AzureEnvironment; } });
const synapseclient_enum_1 = require("./synapseclient.enum");
class SynapseClient {
    constructor(serviceClientCredentialBuilder, params, azureClientHandler) {
        this.apiClientHandler = azureClientHandler;
        this.serviceClientCredentialBuilder = serviceClientCredentialBuilder;
        this.params = params;
        this.synapseAddress = this.getSynapseAddress(this.params.azureEnvironment);
    }
    getSynapseClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.synapseClient === undefined) {
                this.synapseClient = yield this.getAzureServiceClient(synapseclient_enum_1.TokenAudience.Synapse);
            }
            return this.synapseClient;
        });
    }
    getManagementClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.managementClient === undefined) {
                this.managementClient = yield this.getAzureServiceClient(this.params.azureEnvironment.resourceManagerEndpointUrl);
            }
            return this.managementClient;
        });
    }
    getAzureServiceClient(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ms_rest_1.ServiceClient(yield this.serviceClientCredentialBuilder.serviceClientCredential(audience));
        });
    }
    getOperationEndpoint(base, subscription, resourceGroupName, workspaceName, operationId) {
        return `${base}
        /subscriptions/${subscription}
        /resourceGroups/${resourceGroupName}
        /providers/Microsoft.Synapse/workspaces/${workspaceName}
        /operationStatuses/${operationId}?api-version=2019-06-01-preview`;
    }
    getSynapseArtifactEndpoint(workspaceName, synapseAddress, artifactType, artifactName) {
        return `https://${workspaceName}.${synapseAddress}/${artifactType}/${artifactName}`;
    }
    getSynapseAddress(environment) {
        switch (environment) {
            case ms_rest_azure_1.AzureEnvironment.Azure:
                return "dev.azuresynapse.net";
            case ms_rest_azure_1.AzureEnvironment.AzureUSGovernment:
                return "dev.azuresynapse.usgovcloudapi.net";
            default:
                throw {
                    code: 400,
                    message: `Service connection was setup using an unsupported environment: ${environment}. Supported environments are: AzureCloud, AzureUSGovernment`,
                };
        }
    }
    checkArtifactPublishStatusAsync(operationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkStatusOptions = {
                method: "GET",
                url: this.getOperationEndpoint(this.params.azureEnvironment.resourceManagerEndpointUrl, this.params.subscriptionId, this.params.resourceGroupName, this.params.workspaceName, operationId),
                serializationMapper: undefined,
                deserializationMapper: undefined,
            };
            return yield this.apiClientHandler.callApi(yield this.getManagementClient(), checkStatusOptions, [
                200,
            ]);
        });
    }
    publishArtifactAsync(artifact) {
        return __awaiter(this, void 0, void 0, function* () {
            const publishOptions = {
                method: "PUT",
                url: this.getSynapseArtifactEndpoint(this.params.workspaceName, this.synapseAddress, artifact.type, artifact.name),
                serializationMapper: undefined,
                deserializationMapper: undefined,
                headers: {
                    "Content-Type": "application/json",
                },
                body: artifact.json,
                disableJsonStringifyOnBody: true,
            };
            return this.apiClientHandler.callApi(yield this.getSynapseClient(), publishOptions, [200, 202]);
        });
    }
    getTriggersAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://${this.params.workspaceName}.${this.synapseAddress}/triggers?api-version=2019-06-01-preview`;
            const deployOptions = {
                method: "Get",
                url: url,
                serializationMapper: undefined,
                deserializationMapper: undefined,
            };
            return yield this.apiClientHandler.callApi(yield this.getSynapseClient(), deployOptions, [200]);
        });
    }
    getTriggerAsync(triggerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://${this.params.workspaceName}.${this.synapseAddress}/triggers/${triggerName}?api-version=2019-06-01-preview`;
            const deployOptions = {
                method: "Get",
                url: url,
                serializationMapper: undefined,
                deserializationMapper: undefined,
            };
            return yield this.apiClientHandler.callApi(yield this.getSynapseClient(), deployOptions, [200]);
        });
    }
    startStopTriggerAsync(triggerName, toggleOn) {
        return __awaiter(this, void 0, void 0, function* () {
            const toggleOption = toggleOn ? "start" : "stop";
            const url = `https://${this.params.workspaceName}.${this.synapseAddress}/triggers/${triggerName}/${toggleOption}?api-version=2019-06-01-preview`;
            const deployOptions = {
                method: "Post",
                url: url,
                serializationMapper: undefined,
                deserializationMapper: undefined,
            };
            return yield this.apiClientHandler.callApi(yield this.getSynapseClient(), deployOptions, [200]);
        });
    }
}
exports.SynapseClient = SynapseClient;
//# sourceMappingURL=synapseclient.js.map