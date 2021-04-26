import { AzureEnvironment } from "ms-rest-azure";
import { IServiceClientCredentialBuilder } from "../auth/credentialbuilder.interface";
import { IAzureServiceClientHandler } from "./clienthandler.interface";
import { IArtifact, IArtifactPublishOperationResponse, IArtifactPublishStatusResult, IGetTriggersResult, ISynapseApi, ISynapseApiParameters, ITriggerSchema } from "./synapseclient.interface";
export { SynapseClient, AzureEnvironment };
declare class SynapseClient implements ISynapseApi {
    private synapseAddress;
    private synapseClient;
    private managementClient;
    private apiClientHandler;
    private serviceClientCredentialBuilder;
    private params;
    constructor(serviceClientCredentialBuilder: IServiceClientCredentialBuilder, params: ISynapseApiParameters, azureClientHandler: IAzureServiceClientHandler);
    private getSynapseClient;
    private getManagementClient;
    private getAzureServiceClient;
    private getOperationEndpoint;
    private getSynapseArtifactEndpoint;
    private getSynapseAddress;
    checkArtifactPublishStatusAsync(operationId: string): Promise<IArtifactPublishStatusResult>;
    publishArtifactAsync(artifact: IArtifact): Promise<IArtifactPublishOperationResponse>;
    getTriggersAsync(): Promise<IGetTriggersResult>;
    getTriggerAsync(triggerName: string): Promise<ITriggerSchema>;
    startStopTriggerAsync(triggerName: string, toggleOn: boolean): Promise<unknown>;
}
