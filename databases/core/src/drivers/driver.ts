import { DbConfig } from ".."
import { DockerDriver } from "./docker_driver.js";
import { KubectlDriver } from "./kubectl_driver.js";

export interface IDriver {
    waitTillOnline(): Promise<void>
    executeSql(sql: string): Promise<void>
}

export function driverFactory(config: DbConfig): IDriver {
    switch (config.driver.name) {
        case "kubectl":
            return new KubectlDriver(config.driver.pod, config.driver.namespace);
        case "docker":
            return new DockerDriver(config.driver.container);
    }
}
