import { glob } from "glob";
import { dirname, join } from "path";
const protoGlob = "proto/**/*.proto";
export async function getProtoFiles() {
    var packagePath = import.meta.url;
    const filePrefix = "file://";
    if (packagePath.startsWith(filePrefix)) {
        packagePath = packagePath.substring(filePrefix.length, packagePath.length);
    }
    packagePath = join(dirname(packagePath), "../..");
    const files = await glob(protoGlob, {
        cwd: packagePath + "/",
    });
    return files.map(x => join(packagePath, x));
}
