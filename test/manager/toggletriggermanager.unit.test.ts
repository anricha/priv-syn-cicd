import { beforeEach, expect, jest, test } from "@jest/globals";
import { mocked } from "ts-jest/utils";
import { SynapseClient } from "../../lib/client/synapseclient";
import { TriggerActivationState } from "../../lib/client/synapseclient.enum";
import { ToggleTriggersManager } from "../../lib/manager/toggletriggersmanager";
import { IToggleTriggersParameters } from "../../lib/manager/toggletriggersmanager.interface";


jest.mock("../../lib/client/synapseclient");
const mockedClient = mocked(SynapseClient, true);
const toggleTriggerParams: IToggleTriggersParameters = {
    toggleOn: true,
    triggerNames: ["*"],
};

const toggleTrigger = new ToggleTriggersManager(mockedClient, toggleTriggerParams);

function mockGetTriggerAsyncResponse(state: TriggerActivationState) {
    return { properties: { runtimeState: state } };
}

beforeEach(() => {
    mockedClient.getTriggerAsync = jest.fn();
    mockedClient.startStopTriggerAsync = jest.fn();
});

test("ToggleOnSuccess", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync.mockReturnValue(mockGetTriggerAsyncResponse(TriggerActivationState.Started));
    let result = await toggleTrigger.toggleTriggerOnAsync(triggerName);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: true });
});

test("ToggleOnFailure", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync.mockReturnValue(mockGetTriggerAsyncResponse(TriggerActivationState.Stopped));
    let result = await toggleTrigger.toggleTriggerOnAsync(triggerName);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: false });
});

test("ToggleOffSuccess", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync.mockReturnValue(mockGetTriggerAsyncResponse(TriggerActivationState.Started));
    let result = await toggleTrigger.toggleTriggerOnAsync(triggerName);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: true });
});

test("ToggleOffFailure", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync.mockReturnValue(mockGetTriggerAsyncResponse(TriggerActivationState.Stopped));

    let result = await toggleTrigger.toggleTriggerOnAsync(triggerName);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: false });
});

test("ToggleTriggerWhenDisabled", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync.mockReturnValue(mockGetTriggerAsyncResponse(TriggerActivationState.Disabled));
    let result = await toggleTrigger.toggleTriggerAsync(triggerName, true);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(0);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: true });
});

test("ToggleTriggerOnWhenOn", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync
        .mockReturnValueOnce(mockGetTriggerAsyncResponse(TriggerActivationState.Started))
        .mockReturnValueOnce(mockGetTriggerAsyncResponse(TriggerActivationState.Started));
    let result = await toggleTrigger.toggleTriggerAsync(triggerName, true);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: true });
});

test("ToggleTriggerOnWhenOff", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync
        .mockReturnValueOnce(mockGetTriggerAsyncResponse(TriggerActivationState.Stopped))
        .mockReturnValueOnce(mockGetTriggerAsyncResponse(TriggerActivationState.Started));
    let result = await toggleTrigger.toggleTriggerAsync(triggerName, true);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: true });
});

test("ToggleTriggerOffWhenOff", async () => {
    let triggerName = "foo";
    mockedClient.getTriggerAsync
        .mockReturnValueOnce(mockGetTriggerAsyncResponse(TriggerActivationState.Started))
        .mockReturnValueOnce(mockGetTriggerAsyncResponse(TriggerActivationState.Stopped));
    let result = await toggleTrigger.toggleTriggerAsync(triggerName, false);
    expect(mockedClient.startStopTriggerAsync).toHaveBeenCalledTimes(1);
    expect(mockedClient.getTriggerAsync).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ triggerName: triggerName, didSucceed: true });
});
