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
exports.AppServiceClientCredentialBuilder = exports.VmMSIClientCredentialBuilder = void 0;
const ms_rest_azure_1 = require("ms-rest-azure");
class VmMSIClientCredentialBuilder {
    serviceClientCredential(tokenAudience) {
        return __awaiter(this, void 0, void 0, function* () {
            const msiVmOptions = {
                resource: tokenAudience,
            };
            return yield ms_rest_azure_1.loginWithVmMSI(msiVmOptions);
        });
    }
}
exports.VmMSIClientCredentialBuilder = VmMSIClientCredentialBuilder;
class AppServiceClientCredentialBuilder {
    constructor(params) {
        this.azureEnvironment = params.azureEnvironment;
        this.servicePrincipalId = params.servicePrincipalId;
        this.servicePrincipalKey = params.servicePrincipalKey;
        this.tenantId = params.tenantId;
    }
    serviceClientCredential(tokenAudience) {
        return __awaiter(this, void 0, void 0, function* () {
            const azureTokenCredentialsOptions = {
                tokenAudience: tokenAudience,
                environment: this.azureEnvironment,
            };
            const authResponse = yield ms_rest_azure_1.loginWithServicePrincipalSecretWithAuthResponse(this.servicePrincipalId, this.servicePrincipalKey, this.tenantId, azureTokenCredentialsOptions);
            return authResponse.credentials;
        });
    }
}
exports.AppServiceClientCredentialBuilder = AppServiceClientCredentialBuilder;
//# sourceMappingURL=credentialbuilder.js.map