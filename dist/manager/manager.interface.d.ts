import { ILogger, ISynapseApi } from "../client/synapseclient.interface";
export { IManager, IManagerParameters, IManagerResult };
interface IManager {
    logger?: ILogger;
    synapseClient: ISynapseApi;
    managerParameters: IManagerParameters;
    execute(): Promise<IManagerResult>;
    withLogging: (logger: ILogger) => this;
}
interface IManagerParameters {
}
interface IManagerResult {
    didSucceed: boolean;
    errors?: any[];
}
