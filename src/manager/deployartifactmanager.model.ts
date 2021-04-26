import { normalize } from "path";
import { ArtifactType } from "../client/synapseclient.enum";
import { IArtifactSource } from "../client/synapseclient.interface";
import { Artifact } from "../client/synapseclient.model";
import { IArtifactGraph } from "./deployartifactmanager.interface";


export { ArtifactGraph, ArtifactProvider };

const ArtifactSources: IArtifactSource[] = [
                { inputName: "LinkedServicePath", type: ArtifactType.LinkedService },
                { inputName: "DatasetPath", type: ArtifactType.Dataset },
                { inputName: "SQLScriptPath", type: ArtifactType.SQLScript },
                { inputName: "DataflowPath", type: ArtifactType.Dataflow },
                { inputName: "PipelinePath", type: ArtifactType.Pipeline },
                { inputName: "TriggerPath", type: ArtifactType.Trigger },
                { inputName: "BigDataPoolPath", type: ArtifactType.BigDataPool },
                { inputName: "SparkJobDefinitionReferencePath", type: ArtifactType.SparkJobDefinition },
                { inputName: "NotebookPath", type: ArtifactType.Notebook },
            ]

const ArtifactReference: Map<string, ArtifactType> = new Map(
    [
        ["DataFlowReference", ArtifactType.Dataflow],
        ["DatasetReference", ArtifactType.Dataset],
        ["LinkedServiceReference", ArtifactType.LinkedService],
        ["NotebookReference", ArtifactType.Notebook],
        ["PipelineReference", ArtifactType.Pipeline],
        ["SparkJobDefinitionReference", ArtifactType.SparkJobDefinition],
        ["BigDataPoolReference", ArtifactType.BigDataPool]
    ]
)

class ArtifactGraph implements IArtifactGraph {
    private artifacts: Artifact[];
    private aritfactHash: Map<string, Artifact> = new Map();
    private deployGroups: Artifact[][] = [];

    constructor(artifacts: Artifact[]) {
        this.artifacts = artifacts;
        this.buildHash();
        this.buildBuckets(this.deployGroups);
    }

    private buildHash() {
        this.artifacts.map((x) => {
            this.aritfactHash.set(x.name + x.type, x);
        });
    }

    private buildBuckets(buckets: Artifact[][]): Artifact[][] {
        let all = ([] as Artifact[]).concat(...buckets);

        if (this.artifacts.every((x) => all.includes(x))) {
            return buckets;
        }

        buckets.push(this.artifacts.filter((x) => this.findDependency(x, x.data).every((x) => all.includes(x)) && !all.includes(x)));

        return this.buildBuckets(buckets);
    }

    private findDependency(artifact: Artifact, json: any): Artifact[] {
        let refs: Artifact[] = [];

        if (json.referenceName && json.type !== "IntegrationRuntimeReference") {
            let artifactType = ArtifactReference.get(json.type);
            let dependency = this.aritfactHash.get(json.referenceName + (artifactType ? artifactType : ArtifactType.Unknown));
            if (dependency) {
                return [dependency];
            }
        }

        for (const key in json) {
            if (json[key] && typeof json[key] === typeof [Object]) {
                refs = refs.concat(this.findDependency(artifact, json[key]));
            }
        }

        return refs.filter((current: Artifact, index: number, array: Artifact[]) => array.indexOf(current) === index);
    }

    public get deploymentGroups(): Artifact[][] {
        return this.deployGroups.filter((x) => x.length > 0);
    }
}

class ArtifactProvider {
    private artifactSources: IArtifactSource[] = [];

    constructor(artifactSources: IArtifactSource[]) {
        this.artifactSources = artifactSources;
    }

    public async getAllArtifacts() {

    }

    private async getArtifactsFromSource(artifactType: ArtifactType, artifactFolder: string): Promise<Artifact[]> {
        const sourceFolder = normalize(artifactFolder);
        // const templateFiles: string[] = task.find(sourceFolder).filter((itemPath: string) => !task.stats(itemPath).isDirectory());
        // return (
        //     templateFiles.map(
        //         (path: string) => {
        //             return new Artifact(artifactType, path)
        //         }
        //     )
        // )
        return null;
    }

    // private async getArtifacts(artifactType: ArtifactType, artifactFolder: string): Promise<Artifact[]> {
    //     const sourceFolder = normalize(artifactFolder);
    //     const templateFiles: string[] = task.find(sourceFolder).filter((itemPath: string) => !task.stats(itemPath).isDirectory());
    //     return (
    //         templateFiles.map(
    //             (path: string) => {
    //                 console.log(`Loading ${artifactType} artifact from ${path}`)
    //                 return new Artifact(artifactType, path)
    //             }
    //         )
    //     )
    // }
}