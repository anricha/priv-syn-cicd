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
exports.AzureServiceClientHandler = void 0;
class AzureServiceClientHandler {
    callApi(serviceClient, options, successfulStatusCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiResponse = yield serviceClient.sendRequestWithHttpOperationResponse(options);
                if (apiResponse.response.statusCode && successfulStatusCodes.includes(apiResponse.response.statusCode)) {
                    return apiResponse.body;
                }
                throw JSON.stringify({
                    error: apiResponse.response.statusCode,
                    message: JSON.stringify(apiResponse.body),
                    at: "CallApi",
                });
            }
            catch (error) {
                throw JSON.stringify({
                    error: error,
                    at: "CallApi",
                });
            }
        });
    }
}
exports.AzureServiceClientHandler = AzureServiceClientHandler;
//# sourceMappingURL=clienthandler.js.map