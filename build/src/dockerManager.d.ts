import Dockerode from 'dockerode';
import ora from 'ora';
declare class DockerManager {
    networkName: string | null;
    coreClusters: number;
    readReplicas: number;
    ignoreInput: boolean;
    baseName: string;
    username: string;
    imageName: string;
    password: string;
    basePorts: {
        BOLT: string;
        HTTP: string;
        HTTPS: string;
    };
    static dockerDriver: Dockerode;
    static spinner: ora.Ora;
    constructor({ coreClusters, readReplicas, imageName, username, password, }: {
        coreClusters: number;
        readReplicas: number;
        imageName: string;
        username: string;
        password: string;
    });
    static successSpinner(): void;
    static failSpinner(): void;
    static startSpinner(text: string): void;
    static errorMessage(message: string): void;
    static fatalFail(message: string): void;
    /** Remove all the containers generated from boltnet */
    static cleanBoltnetContainers(): void;
    /** Checks is docker is enabled */
    pingDocker(): Promise<void>;
    /** Create a network stack on the default Docker bridge */
    createNetwork(): Promise<void>;
    /** Prune available unused Docker networks */
    static pruneNetworks(): Promise<void>;
    /** Create and run containers */
    runContainers(): Promise<void>;
}
export default DockerManager;
