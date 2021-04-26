import { readFileSync } from 'fs';
import { parse } from "path";
import { ArtifactType } from "./synapseclient.enum";
import { IArtifact } from "./synapseclient.interface";

export { Artifact };

class Artifact implements IArtifact {
    type: ArtifactType;
    json: string;
    data: any;
    name: string;

    constructor(artifactType: ArtifactType, artifactJsonPath: string) {
        this.type = artifactType;
        this.json = readFileSync(artifactJsonPath, "utf-8");
        this.data = JSON.parse(this.json);
        this.name = this.data.name || parse(artifactJsonPath).name;
    }
}
