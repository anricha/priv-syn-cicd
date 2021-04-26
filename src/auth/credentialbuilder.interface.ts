import { ServiceClientCredentials } from "ms-rest";
import { AzureEnvironment } from "ms-rest-azure";

export { IServiceClientCredentialBuilder, IAppServiceClientCredentialBuilderParams };

interface IServiceClientCredentialBuilder {
    serviceClientCredential: (tokenAudience: string) => Promise<ServiceClientCredentials>;
}

interface IAppServiceClientCredentialBuilderParams {
    azureEnvironment: AzureEnvironment;
    servicePrincipalId: string;
    servicePrincipalKey: string;
    tenantId: string;
}
