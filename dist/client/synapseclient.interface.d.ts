import { AzureEnvironment } from "ms-rest-azure";
import { ArtifactType } from "./synapseclient.enum";
export { ISynapseApi, ISynapseApiParameters, IArtifact, IGetTriggersResult, ITriggerSchema, IBadResult, IArtifactPublishStatusResult, IArtifactPublishOperationResponse, IToggleTriggerResult, ILogger, IArtifactDeploymentResult, ISynapseClientException, IArtifactSource, };
interface ISynapseClientException {
    error: string;
    message?: string;
    at: string;
}
interface IArtifact {
    type: ArtifactType;
    json: string;
    data: unknown;
    name: string;
}
interface IHttpResult {
    code: string;
    message: string;
}
interface ITriggerProperties {
    annotations: Record<string, unknown>[];
    pipelines: {
        referenceName: string;
        type: string;
    }[];
    runtimeState: string;
    type: string;
    typeProperties: {
        frequency: string;
        interval: number;
        schedule: Record<string, unknown>;
        startTime: string;
        timeZone: string;
    };
}
interface IArtifactSource {
    inputName: string;
    path?: string;
    type: ArtifactType;
}
interface ITriggerSchema extends IHttpResult {
    etag: string;
    id: string;
    name: string;
    properties: ITriggerProperties;
}
interface IToggleTriggerResult {
    triggerName: string;
    didSucceed: boolean;
    error?: Error;
}
interface IGetTriggersResult extends IHttpResult {
    value: ITriggerSchema[];
}
interface ISynapseApi {
    publishArtifactAsync: (artifact: IArtifact) => Promise<IArtifactPublishOperationResponse>;
    checkArtifactPublishStatusAsync: (operationId: string) => Promise<IArtifactPublishStatusResult>;
    getTriggersAsync: () => Promise<IGetTriggersResult>;
    getTriggerAsync: (triggerName: string) => Promise<ITriggerSchema>;
    startStopTriggerAsync: (triggerName: string, toggleOn: boolean) => void;
}
interface ISynapseApiParameters {
    azureEnvironment: AzureEnvironment;
    workspaceName: string;
    resourceGroupName: string;
    subscriptionId: string;
}
interface ILogger {
    info: (message: string) => string;
    error: (message: any) => any;
    debug: (message: string) => string;
    publishingArtifact: (artifact: IArtifact) => IArtifact;
}
interface IBadResult {
    code: number;
    message: string;
}
interface IArtifactPublishOperationResponse {
    code: 200 | 202;
    name: string;
    operationId: string;
    state: string;
    type: string;
}
interface IArtifactPublishStatusResult {
    status: string;
    error: IBadResult | undefined;
}
interface IArtifactDeploymentResult {
    ArtifactName: string;
    ResultObject?: IArtifactPublishStatusResult | IBadResult;
    Determination: string;
}
