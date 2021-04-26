import { Mapper, ServiceClient, UrlBasedRequestPrepareOptions } from "ms-rest";
import { AzureEnvironment } from "ms-rest-azure";
import { IServiceClientCredentialBuilder } from "../auth/credentialbuilder.interface";
import { IAzureServiceClientHandler } from "./clienthandler.interface";
import { ArtifactType, TokenAudience } from "./synapseclient.enum";
import {
    IArtifact,
    IArtifactPublishOperationResponse,
    IArtifactPublishStatusResult,
    IBadResult,
    IGetTriggersResult,
    ISynapseApi,
    ISynapseApiParameters,
    ITriggerSchema
} from "./synapseclient.interface";

export { SynapseClient, AzureEnvironment };

class SynapseClient implements ISynapseApi {
    private synapseAddress: string;
    private synapseClient: ServiceClient | undefined;
    private managementClient: ServiceClient | undefined;
    private apiClientHandler: IAzureServiceClientHandler;
    private serviceClientCredentialBuilder: IServiceClientCredentialBuilder;
    private params: ISynapseApiParameters;

    constructor(
        serviceClientCredentialBuilder: IServiceClientCredentialBuilder,
        params: ISynapseApiParameters,
        azureClientHandler: IAzureServiceClientHandler
    ) {
        this.apiClientHandler = azureClientHandler;
        this.serviceClientCredentialBuilder = serviceClientCredentialBuilder;
        this.params = params;
        this.synapseAddress = this.getSynapseAddress(this.params.azureEnvironment);
    }

    private async getSynapseClient(): Promise<ServiceClient> {
        if (this.synapseClient === undefined) {
            this.synapseClient = await this.getAzureServiceClient(TokenAudience.Synapse);
        }
        return <ServiceClient>this.synapseClient;
    }

    private async getManagementClient(): Promise<ServiceClient> {
        if (this.managementClient === undefined) {
            this.managementClient = await this.getAzureServiceClient(this.params.azureEnvironment.resourceManagerEndpointUrl);
        }
        return <ServiceClient>this.managementClient;
    }

    private async getAzureServiceClient(audience: string): Promise<ServiceClient> {
        return new ServiceClient(await this.serviceClientCredentialBuilder.serviceClientCredential(audience));
    }

    private getOperationEndpoint(
        base: string,
        subscription: string,
        resourceGroupName: string,
        workspaceName: string,
        operationId: string
    ): string {
        return `${base}
        /subscriptions/${subscription}
        /resourceGroups/${resourceGroupName}
        /providers/Microsoft.Synapse/workspaces/${workspaceName}
        /operationStatuses/${operationId}?api-version=2019-06-01-preview`;
    }

    private getSynapseArtifactEndpoint(
        workspaceName: string,
        synapseAddress: string,
        artifactType: ArtifactType,
        artifactName: string
    ): string {
        return `https://${workspaceName}.${synapseAddress}/${artifactType}/${artifactName}`;
    }

    private getSynapseAddress(environment: AzureEnvironment): string {
        switch (environment) {
        case AzureEnvironment.Azure:
            return "dev.azuresynapse.net";
        case AzureEnvironment.AzureUSGovernment:
            return "dev.azuresynapse.usgovcloudapi.net";
        default:
            throw {
                code: 400,
                message: `Service connection was setup using an unsupported environment: ${environment}. Supported environments are: AzureCloud, AzureUSGovernment`,
            } as IBadResult;
        }
    }

    // Deploy Artifacts Region Start
    public async checkArtifactPublishStatusAsync(operationId: string): Promise<IArtifactPublishStatusResult> {
        const checkStatusOptions: UrlBasedRequestPrepareOptions = {
            method: "GET",
            url: this.getOperationEndpoint(
                this.params.azureEnvironment.resourceManagerEndpointUrl,
                this.params.subscriptionId,
                this.params.resourceGroupName,
                this.params.workspaceName,
                operationId
            ),
            serializationMapper: <Mapper>(<unknown>undefined),
            deserializationMapper: <Mapper>(<unknown>undefined),
        };

        return await this.apiClientHandler.callApi<IArtifactPublishStatusResult>(await this.getManagementClient(), checkStatusOptions, [
            200,
        ]);
    }

    public async publishArtifactAsync(artifact: IArtifact): Promise<IArtifactPublishOperationResponse> {
        const publishOptions: UrlBasedRequestPrepareOptions = {
            method: "PUT",
            url: this.getSynapseArtifactEndpoint(this.params.workspaceName, this.synapseAddress, artifact.type, artifact.name),
            serializationMapper: <Mapper>(<unknown>undefined),
            deserializationMapper: <Mapper>(<unknown>undefined),
            headers: {
                "Content-Type": "application/json",
            },
            body: artifact.json,
            disableJsonStringifyOnBody: true,
        };
        return this.apiClientHandler.callApi<IArtifactPublishOperationResponse>(await this.getSynapseClient(), publishOptions, [200, 202]);
    }
    //Deploy Artifact Region End

    // ToggleTriggers Region Start
    public async getTriggersAsync(): Promise<IGetTriggersResult> {
        const url = `https://${this.params.workspaceName}.${this.synapseAddress}/triggers?api-version=2019-06-01-preview`;

        const deployOptions: UrlBasedRequestPrepareOptions = {
            method: "Get",
            url: url,
            serializationMapper: <Mapper>(<unknown>undefined),
            deserializationMapper: <Mapper>(<unknown>undefined),
        };
        return await this.apiClientHandler.callApi<IGetTriggersResult>(await this.getSynapseClient(), deployOptions, [200]);
    }

    public async getTriggerAsync(triggerName: string): Promise<ITriggerSchema> {
        const url = `https://${this.params.workspaceName}.${this.synapseAddress}/triggers/${triggerName}?api-version=2019-06-01-preview`;
        const deployOptions: UrlBasedRequestPrepareOptions = {
            method: "Get",
            url: url,
            serializationMapper: <Mapper>(<unknown>undefined),
            deserializationMapper: <Mapper>(<unknown>undefined),
        };
        return await this.apiClientHandler.callApi<ITriggerSchema>(await this.getSynapseClient(), deployOptions, [200]);
    }

    public async startStopTriggerAsync(triggerName: string, toggleOn: boolean) {
        const toggleOption = toggleOn ? "start" : "stop";
        const url = `https://${this.params.workspaceName}.${this.synapseAddress}/triggers/${triggerName}/${toggleOption}?api-version=2019-06-01-preview`;
        const deployOptions: UrlBasedRequestPrepareOptions = {
            method: "Post",
            url: url,
            serializationMapper: <Mapper>(<unknown>undefined),
            deserializationMapper: <Mapper>(<unknown>undefined),
        };
        return await this.apiClientHandler.callApi(await this.getSynapseClient(), deployOptions, [200]);
    }

    // ToggleTriggers region end
}
