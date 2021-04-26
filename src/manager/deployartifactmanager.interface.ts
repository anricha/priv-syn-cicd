import { IArtifactSource } from "../client/synapseclient.interface";
import { Artifact } from "../client/synapseclient.model";
import { IManager, IManagerParameters, IManagerResult } from "./manager.interface";

export { IDeployArtifactManager, IDeployArtifactManagerResult, IDeployArtifactParameters, IArtifactGraph };

interface IDeployArtifactManager extends IManager {
    artifactGraph: IArtifactGraph
    artifactSources: IArtifactSource[];
}

type IDeployArtifactManagerResult = IManagerResult

interface IDeployArtifactParameters extends IManagerParameters {
    continue: boolean;
    throttle: number;
    throwErrorOnNonUpdatable: boolean;
    millisecondDelay: number;
    millisecondsToVerify: number;
}

interface IArtifactGraph {
    deploymentGroups: Artifact[][]
}
