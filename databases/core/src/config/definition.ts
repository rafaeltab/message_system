export type DbConfig = {
    driver: {
        name: "kubectl",
        pod: string,
        namespace?: string
    } | {
        name: "docker",
        container: string
    },
    host: string,
    username?: string,
    password?: string,
    database: string,
    changelogPath: string,
    port: number
}
