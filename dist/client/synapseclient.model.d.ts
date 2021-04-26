import { ArtifactType } from "./synapseclient.enum";
import { IArtifact } from "./synapseclient.interface";
export { Artifact };
declare class Artifact implements IArtifact {
    type: ArtifactType;
    json: string;
    data: any;
    name: string;
    constructor(artifactType: ArtifactType, artifactJsonPath: string);
}
