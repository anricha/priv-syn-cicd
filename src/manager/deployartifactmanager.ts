import { delay } from "q";
import throat from 'throat';
import { IArtifactDeploymentResult, IArtifactPublishStatusResult, IArtifactSource, ILogger, ISynapseApi } from "../client/synapseclient.interface";
import { Artifact } from "../client/synapseclient.model";
import { IPathResolver } from "../utility/PathResolver.interface";
import { IArtifactGraph, IDeployArtifactManager, IDeployArtifactManagerResult, IDeployArtifactParameters } from "./deployartifactmanager.interface";


export { DeployArtifactManager };

class DeployArtifactManager implements IDeployArtifactManager {
    logger: ILogger;
    synapseClient: ISynapseApi;
    managerParameters: IDeployArtifactParameters;
    artifactGraph: IArtifactGraph;

    pathResolver: IPathResolver;
    artifactSources: IArtifactSource[];

    constructor(
        synapseClient: ISynapseApi,
        managerParameters: IDeployArtifactParameters,
        artifactGraph: IArtifactGraph
    ) {
        this.synapseClient = synapseClient;
        this.managerParameters = managerParameters;
        this.artifactGraph = artifactGraph;
    }

    private async verifyDeployment(operationId: string, delayMilliseconds: number, maxMilliseconds: number): Promise<IArtifactPublishStatusResult> {
        if (maxMilliseconds <= 0) {
            throw {
                code: "MaxIterationExceeded",
                message: "The deployment status was not verified within the configured amount of time."
            }
        }

        const statusResult: IArtifactPublishStatusResult = await delay(await this.synapseClient.checkArtifactPublishStatusAsync(operationId), delayMilliseconds);

        if (statusResult.error) {
            throw statusResult.error;
        }

        if (statusResult.status && statusResult.status == "InProgress") {
            return await this.verifyDeployment(operationId, delayMilliseconds, maxMilliseconds - delayMilliseconds)
        }

        return statusResult;
    }

    private async deployArtifact(artifact: Artifact, delayMilliseconds: number, maxMilliseconds: number): Promise<IArtifactDeploymentResult> {

        const deploymentResult: IArtifactDeploymentResult = {
            ArtifactName: artifact.name,
            Determination: 'Succeeded'
        }

        // If no exception is thrown, artifact deployment was successful
        // If exception was thrown, it could be that the API call failed or the artifact deployment failed
        try {
            let acceptedResult = await this.synapseClient.publishArtifactAsync(artifact);
            let verifiedResult = await this.verifyDeployment(acceptedResult.operationId, delayMilliseconds, maxMilliseconds);
            deploymentResult.ResultObject = verifiedResult;
            return deploymentResult
        } catch (err) {
            let debugError = err;
        }
    }

    async execute(): Promise<IDeployArtifactManagerResult> {
        // Begin deploying artifacts in groups by their dependencies
        // Artifacts with 0 dependencies first, then artifacts which depend on the previous group, and so on
        // If an artifact fails to deploy, subsequent groups will not deploy
        const results = await this.artifactGraph.deploymentGroups.reduce(
            async (previousValue: Promise<IArtifactDeploymentResult[]>, currentValue: Artifact[]) => {
                const chainResults = await previousValue;
                const currentResult = await Promise.all(
                    currentValue.map(
                        throat(this.managerParameters.throttle, (artifact) => {
                            let result = this.deployArtifact(
                                artifact,
                                this.managerParameters.millisecondDelay,
                                this.managerParameters.millisecondsToVerify
                            );
                            return result;
                        })
                    )
                );
                return chainResults.concat(currentResult);
            }, Promise.resolve([])
        )

        return {
            didSucceed: true,
            errors: []
        };
    }

    withLogging(logger: ILogger): this {
        this.logger = logger;
        return this;
    }
}
