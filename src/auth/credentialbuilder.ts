import {
    ApplicationTokenCredentials,
    AzureEnvironment,
    AzureTokenCredentialsOptions,
    loginWithServicePrincipalSecretWithAuthResponse,
    loginWithVmMSI,
    MSIVmOptions,
    MSIVmTokenCredentials,
} from "ms-rest-azure";
import { IAppServiceClientCredentialBuilderParams, IServiceClientCredentialBuilder } from "./credentialbuilder.interface";

export { VmMSIClientCredentialBuilder, AppServiceClientCredentialBuilder };

class VmMSIClientCredentialBuilder implements IServiceClientCredentialBuilder {
    async serviceClientCredential(tokenAudience: string): Promise<MSIVmTokenCredentials> {
        const msiVmOptions: MSIVmOptions = {
            resource: tokenAudience,
        };

        return await loginWithVmMSI(msiVmOptions);
    }
}

class AppServiceClientCredentialBuilder implements IServiceClientCredentialBuilder {
    private azureEnvironment: AzureEnvironment;
    private servicePrincipalId: string;
    private servicePrincipalKey: string;
    private tenantId: string;

    constructor(params: IAppServiceClientCredentialBuilderParams) {
        this.azureEnvironment = params.azureEnvironment;
        this.servicePrincipalId = params.servicePrincipalId;
        this.servicePrincipalKey = params.servicePrincipalKey;
        this.tenantId = params.tenantId;
    }

    async serviceClientCredential(tokenAudience: string): Promise<ApplicationTokenCredentials> {
        const azureTokenCredentialsOptions: AzureTokenCredentialsOptions = {
            tokenAudience: tokenAudience,
            environment: this.azureEnvironment,
        };

        const authResponse = await loginWithServicePrincipalSecretWithAuthResponse(
            this.servicePrincipalId,
            this.servicePrincipalKey,
            this.tenantId,
            azureTokenCredentialsOptions
        );
        return authResponse.credentials;
    }
}
