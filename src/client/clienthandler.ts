import { ServiceClient, UrlBasedRequestPrepareOptions } from "ms-rest";
import { IAzureClientResponse, IAzureServiceClientHandler } from "./clienthandler.interface";

export { AzureServiceClientHandler, IAzureServiceClientHandler, IAzureClientResponse };

class AzureServiceClientHandler implements IAzureServiceClientHandler {
    async callApi<T>(serviceClient: ServiceClient, options: UrlBasedRequestPrepareOptions, successfulStatusCodes: number[]): Promise<T> {
        try {
            const apiResponse = await serviceClient.sendRequestWithHttpOperationResponse<T>(options);
            if (apiResponse.response.statusCode && successfulStatusCodes.includes(apiResponse.response.statusCode)) {
                return apiResponse.body as T;
            }

            throw JSON.stringify({
                error: apiResponse.response.statusCode,
                message: JSON.stringify(apiResponse.body),
                at: "CallApi",
            });
        } catch (error) {
            throw JSON.stringify({
                error: error,
                at: "CallApi",
            });
        }
    }
}
