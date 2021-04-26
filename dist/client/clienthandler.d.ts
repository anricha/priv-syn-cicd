import { ServiceClient, UrlBasedRequestPrepareOptions } from "ms-rest";
import { IAzureClientResponse, IAzureServiceClientHandler } from "./clienthandler.interface";
export { AzureServiceClientHandler, IAzureServiceClientHandler, IAzureClientResponse };
declare class AzureServiceClientHandler implements IAzureServiceClientHandler {
    callApi<T>(serviceClient: ServiceClient, options: UrlBasedRequestPrepareOptions, successfulStatusCodes: number[]): Promise<T>;
}
