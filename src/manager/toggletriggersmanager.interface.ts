import { IManagerResult, IManager, IManagerParameters } from "./manager.interface";

export { IToggleTriggersManager, IToggleTriggersResult, IToggleTriggerResult, IManagerResult, IToggleTriggersParameters };

interface IToggleTriggersParameters extends IManagerParameters {
    toggleOn: boolean;
    triggerNames: string[];
}

interface IToggleTriggersManager extends IManager {
    managerParameters: IToggleTriggersParameters;

    toggleTriggerOnAsync: (triggerName: string) => Promise<IToggleTriggerResult>;
    toggleTriggerOffAsync: (triggerName: string) => Promise<IToggleTriggerResult>;
    toggleTriggerAsync: (triggerName: string, toggleOn: boolean) => Promise<IToggleTriggerResult>;
}

interface IToggleTriggerResult {
    triggerName: string;
    didSucceed: boolean;
    error?: any;
}

type IToggleTriggersResult = IManagerResult;
