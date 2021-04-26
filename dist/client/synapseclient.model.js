"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artifact = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class Artifact {
    constructor(artifactType, artifactJsonPath) {
        this.type = artifactType;
        this.json = fs_1.readFileSync(artifactJsonPath, "utf-8");
        this.data = JSON.parse(this.json);
        this.name = this.data.name || path_1.parse(artifactJsonPath).name;
    }
}
exports.Artifact = Artifact;
//# sourceMappingURL=synapseclient.model.js.map