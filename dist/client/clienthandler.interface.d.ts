import { ServiceClient, UrlBasedRequestPrepareOptions } from "ms-rest";
export { IAzureClientResponse, IAzureServiceClientHandler };
interface IAzureClientResponse<T> {
    good: boolean;
    data: T;
}
interface IAzureServiceClientHandler {
    callApi: <T>(serviceClient: ServiceClient, options: UrlBasedRequestPrepareOptions, successfulStatusCodes: number[]) => Promise<T>;
}
