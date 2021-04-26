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
exports.ToggleTriggersManager = void 0;
const synapseclient_enum_1 = require("../client/synapseclient.enum");
class ToggleTriggersManager {
    constructor(synapseClient, managerParameters) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug("Initializing ToggleTriggerManager...");
        this.synapseClient = synapseClient;
        this.managerParameters = managerParameters;
    }
    toggleTriggerOnAsync(triggerName) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Attemping to start ${triggerName}`);
            yield this.synapseClient.startStopTriggerAsync(triggerName, true);
            const newDetails = yield this.synapseClient.getTriggerAsync(triggerName);
            if (newDetails.properties.runtimeState == synapseclient_enum_1.TriggerActivationState.Started) {
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info(`Toggled ${triggerName} on`);
                return {
                    triggerName: triggerName,
                    didSucceed: true,
                };
            }
            else {
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.error(`Failed to toggle trigger ${triggerName}.`);
                return {
                    triggerName: triggerName,
                    didSucceed: false,
                };
            }
        });
    }
    toggleTriggerOffAsync(triggerName) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Attemping to stop ${triggerName}`);
            yield this.synapseClient.startStopTriggerAsync(triggerName, false);
            const newDetails = yield this.synapseClient.getTriggerAsync(triggerName);
            if (newDetails.properties.runtimeState == synapseclient_enum_1.TriggerActivationState.Stopped) {
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info(`Toggled ${triggerName} off`);
                return {
                    triggerName: triggerName,
                    didSucceed: true,
                };
            }
            else {
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.error(`Failed to toggle trigger ${triggerName}.`);
                return {
                    triggerName: triggerName,
                    didSucceed: true,
                };
            }
        });
    }
    toggleTriggerAsync(triggerName, toggleOn) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let triggerDetails;
            try {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Checking to see if trigger ${triggerName} exists`);
                triggerDetails = yield this.synapseClient.getTriggerAsync(triggerName);
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug(`Trigger ${triggerName} exists`);
                const toggleTo = toggleOn ? "On" : "Off";
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.info(`Toggling ${triggerName} ${toggleTo}`);
                const originalActivationStatus = triggerDetails.properties.runtimeState;
                (_d = this.logger) === null || _d === void 0 ? void 0 : _d.debug(`Trigger ${triggerName} is ${originalActivationStatus}`);
                if (originalActivationStatus == synapseclient_enum_1.TriggerActivationState.Disabled) {
                    (_e = this.logger) === null || _e === void 0 ? void 0 : _e.info(`Trigger ${triggerName} status is ${originalActivationStatus}. Skipping...`);
                    return {
                        triggerName: triggerName,
                        didSucceed: true,
                    };
                }
                (_f = this.logger) === null || _f === void 0 ? void 0 : _f.debug(`Attemping to start or stop trigger ${triggerName}`);
                return toggleOn ? yield this.toggleTriggerOnAsync(triggerName) : yield this.toggleTriggerOffAsync(triggerName);
            }
            catch (error) {
                return {
                    triggerName: triggerName,
                    didSucceed: false,
                    error: error,
                };
            }
        });
    }
    withLogging(logger) {
        this.logger = logger;
        return this;
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug("Executing ToggleTriggersManager");
            let triggersNames;
            if (this.managerParameters.triggerNames[0] == "*") {
                triggersNames = (yield this.synapseClient.getTriggersAsync()).value.map((ts) => ts.name);
            }
            else {
                triggersNames = this.managerParameters.triggerNames;
            }
            const results = yield Promise.all(triggersNames.map((e) => this.toggleTriggerAsync(e, this.managerParameters.toggleOn)));
            const errors = results.filter((r) => !r.didSucceed);
            return {
                didSucceed: !results.some((r) => !r.didSucceed),
                errors: errors,
            };
        });
    }
}
exports.ToggleTriggersManager = ToggleTriggersManager;
//# sourceMappingURL=toggletriggersmanager.js.map