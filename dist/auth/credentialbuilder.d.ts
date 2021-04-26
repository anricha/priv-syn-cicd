import { ApplicationTokenCredentials, MSIVmTokenCredentials } from "ms-rest-azure";
import { IAppServiceClientCredentialBuilderParams, IServiceClientCredentialBuilder } from "./credentialbuilder.interface";
export { VmMSIClientCredentialBuilder, AppServiceClientCredentialBuilder };
declare class VmMSIClientCredentialBuilder implements IServiceClientCredentialBuilder {
    serviceClientCredential(tokenAudience: string): Promise<MSIVmTokenCredentials>;
}
declare class AppServiceClientCredentialBuilder implements IServiceClientCredentialBuilder {
    private azureEnvironment;
    private servicePrincipalId;
    private servicePrincipalKey;
    private tenantId;
    constructor(params: IAppServiceClientCredentialBuilderParams);
    serviceClientCredential(tokenAudience: string): Promise<ApplicationTokenCredentials>;
}
