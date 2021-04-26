import { TriggerActivationState } from "../client/synapseclient.enum";
import { ILogger, ISynapseApi, ITriggerSchema } from "../client/synapseclient.interface";
import {
    IToggleTriggerResult, IToggleTriggersManager,
    IToggleTriggersParameters, IToggleTriggersResult
} from "./toggletriggersmanager.interface";


export { ToggleTriggersManager };

class ToggleTriggersManager implements IToggleTriggersManager {
    logger?: ILogger;
    synapseClient: ISynapseApi;
    managerParameters: IToggleTriggersParameters;

    constructor(synapseClient: ISynapseApi, managerParameters: IToggleTriggersParameters) {
        this.logger?.debug("Initializing ToggleTriggerManager...");
        this.synapseClient = synapseClient;
        this.managerParameters = managerParameters;
    }

    async toggleTriggerOnAsync(triggerName: string) {
        this.logger?.debug(`Attemping to start ${triggerName}`);
        await this.synapseClient.startStopTriggerAsync(triggerName, true);

        const newDetails = await this.synapseClient.getTriggerAsync(triggerName);
        if (newDetails.properties.runtimeState == TriggerActivationState.Started) {
            this.logger?.info(`Toggled ${triggerName} on`);
            return {
                triggerName: triggerName,
                didSucceed: true,
            };
        } else {
            this.logger?.error(`Failed to toggle trigger ${triggerName}.`);
            return {
                triggerName: triggerName,
                didSucceed: false,
            };
        }
    }

    async toggleTriggerOffAsync(triggerName: string) {
        this.logger?.debug(`Attemping to stop ${triggerName}`);
        await this.synapseClient.startStopTriggerAsync(triggerName, false);
        const newDetails = await this.synapseClient.getTriggerAsync(triggerName);
        if (newDetails.properties.runtimeState == TriggerActivationState.Stopped) {
            this.logger?.info(`Toggled ${triggerName} off`);
            return {
                triggerName: triggerName,
                didSucceed: true,
            };
        } else {
            this.logger?.error(`Failed to toggle trigger ${triggerName}.`);
            return {
                triggerName: triggerName,
                didSucceed: true,
            };
        }
    }

    async toggleTriggerAsync(triggerName: string, toggleOn: boolean): Promise<IToggleTriggerResult> {
        let triggerDetails: ITriggerSchema;

        try {
            this.logger?.debug(`Checking to see if trigger ${triggerName} exists`);
            triggerDetails = await this.synapseClient.getTriggerAsync(triggerName);
            this.logger?.debug(`Trigger ${triggerName} exists`);

            const toggleTo = toggleOn ? "On" : "Off";

            this.logger?.info(`Toggling ${triggerName} ${toggleTo}`);
            const originalActivationStatus = triggerDetails.properties.runtimeState;
            this.logger?.debug(`Trigger ${triggerName} is ${originalActivationStatus}`);

            if (originalActivationStatus == TriggerActivationState.Disabled) {
                // Short circuit if trigger is 'Disabled'; TODO - confirm this behavior
                this.logger?.info(`Trigger ${triggerName} status is ${originalActivationStatus}. Skipping...`);
                return {
                    triggerName: triggerName,
                    didSucceed: true,
                };
            }

            this.logger?.debug(`Attemping to start or stop trigger ${triggerName}`);
            return toggleOn ? await this.toggleTriggerOnAsync(triggerName) : await this.toggleTriggerOffAsync(triggerName);
        } catch (error) {
            return {
                triggerName: triggerName,
                didSucceed: false,
                error: error,
            };
        }
    }

    withLogging(logger: ILogger): this {
        this.logger = logger;
        return this;
    }

    async execute(): Promise<IToggleTriggersResult> {
        this.logger?.debug("Executing ToggleTriggersManager");
        let triggersNames: string[];
        if (this.managerParameters.triggerNames[0] == "*") {
            triggersNames = (await this.synapseClient.getTriggersAsync()).value.map((ts: ITriggerSchema) => ts.name);
        } else {
            triggersNames = this.managerParameters.triggerNames;
        }
        const results = await Promise.all(triggersNames.map((e) => this.toggleTriggerAsync(e, this.managerParameters.toggleOn)));
        const errors = results.filter((r) => !r.didSucceed);
        return {
            didSucceed: !results.some((r) => !r.didSucceed),
            errors: errors,
        };
    }
}
