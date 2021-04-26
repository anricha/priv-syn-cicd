import { ILogger, ISynapseApi } from "../client/synapseclient.interface";
import { IToggleTriggerResult, IToggleTriggersManager, IToggleTriggersParameters, IToggleTriggersResult } from "./toggletriggersmanager.interface";
export { ToggleTriggersManager };
declare class ToggleTriggersManager implements IToggleTriggersManager {
    logger?: ILogger;
    synapseClient: ISynapseApi;
    managerParameters: IToggleTriggersParameters;
    constructor(synapseClient: ISynapseApi, managerParameters: IToggleTriggersParameters);
    toggleTriggerOnAsync(triggerName: string): Promise<{
        triggerName: string;
        didSucceed: boolean;
    }>;
    toggleTriggerOffAsync(triggerName: string): Promise<{
        triggerName: string;
        didSucceed: boolean;
    }>;
    toggleTriggerAsync(triggerName: string, toggleOn: boolean): Promise<IToggleTriggerResult>;
    withLogging(logger: ILogger): this;
    execute(): Promise<IToggleTriggersResult>;
}
