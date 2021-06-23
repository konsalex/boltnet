"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./utils/helpers");
const createMember_1 = __importDefault(require("./utils/createMember"));
const chalk_1 = __importDefault(require("chalk"));
const dockerode_1 = __importDefault(require("dockerode"));
const ora_1 = __importDefault(require("ora"));
class DockerManager {
    constructor({ coreClusters, readReplicas, imageName, username, password, }) {
        DockerManager.spinner.color = 'green';
        this.networkName = null;
        this.username = username;
        this.password = password;
        this.coreClusters = coreClusters;
        this.readReplicas = readReplicas;
        this.imageName = `neo4j:${imageName}`;
        this.ignoreInput = true;
        this.baseName = `boltnet-${helpers_1.randomString(5)}`;
        this.basePorts = {
            BOLT: '7687',
            HTTPS: '7473',
            HTTP: '7474',
        };
    }
    static successSpinner() {
        DockerManager.spinner.succeed();
    }
    static failSpinner() {
        DockerManager.spinner.fail();
    }
    static startSpinner(text) {
        DockerManager.spinner.text = text;
        DockerManager.spinner.start();
    }
    static errorMessage(message) {
        console.log(chalk_1.default.red(message));
    }
    static fatalFail(message) {
        DockerManager.failSpinner();
        this.errorMessage(message);
        throw new Error(message);
    }
    /** Remove all the containers generated from boltnet */
    static cleanBoltnetContainers() {
        DockerManager.startSpinner('Removing all boltnet containers');
        this.dockerDriver.listContainers({ all: true }, (_, containers) => {
            containers === null || containers === void 0 ? void 0 : containers.forEach(containerInfo => {
                if (containerInfo.Names.filter(containerName => new RegExp(/boltnet-/).test(containerName))) {
                    console.log(chalk_1.default.green(`Removing Container ID: ${containerInfo.Id}`));
                    this.dockerDriver
                        .getContainer(containerInfo.Id)
                        .remove({ force: true });
                }
            });
        });
        DockerManager.successSpinner();
    }
    /** Checks is docker is enabled */
    async pingDocker() {
        try {
            DockerManager.startSpinner('Connecting with Docker');
            await DockerManager.dockerDriver.ping();
            DockerManager.successSpinner();
        }
        catch (e) {
            DockerManager.fatalFail(e);
        }
    }
    /** Create a network stack on the default Docker bridge */
    async createNetwork() {
        this.networkName = `boltnet-${helpers_1.randomString(6)}`;
        DockerManager.startSpinner(`Creating Bridge network with name: ${this.networkName}`);
        try {
            await DockerManager.dockerDriver.createNetwork({ Name: this.networkName });
            DockerManager.successSpinner();
        }
        catch (e) {
            DockerManager.fatalFail(e);
        }
    }
    /** Prune available unused Docker networks */
    static async pruneNetworks() {
        DockerManager.startSpinner('Removing Unused Networks');
        try {
            await DockerManager.dockerDriver.pruneNetworks();
            DockerManager.successSpinner();
        }
        catch (e) {
            DockerManager.fatalFail('Could not prune networks');
        }
    }
    /** Create and run containers */
    async runContainers() {
        await this.pingDocker();
        DockerManager.spinner.text = 'Starting Cluster Members';
        DockerManager.spinner.start();
        /**  Create Cluster members */
        for (let i = 0, l = this.coreClusters + this.readReplicas; i < l; i += 1) {
            const options = createMember_1.default({
                id: i,
                baseName: this.baseName,
                networkName: this.networkName,
                options: {
                    username: this.username,
                    password: this.password,
                    clusterSize: this.coreClusters,
                    mode: i + 1 > this.coreClusters ? 'READ_REPLICA' : 'CORE',
                    imageName: this.imageName,
                },
                ports: {
                    container: {
                        /**
                         * Increasing the ports with a magnitude of 10
                         * TODO: Create a more robust way to create consecutive clustes
                         * and avoid port collision
                         */
                        BOLT: `${parseInt(this.basePorts.BOLT) + i * 10}`,
                        HTTP: `${parseInt(this.basePorts.HTTP) + i * 10}`,
                        HTTPS: `${parseInt(this.basePorts.HTTPS) + i * 10}`,
                    },
                    host: this.basePorts,
                },
            });
            const container = await DockerManager.dockerDriver.createContainer(options);
            await container.start();
        }
        DockerManager.spinner.succeed();
    }
}
DockerManager.dockerDriver = new dockerode_1.default();
DockerManager.spinner = ora_1.default();
exports.default = DockerManager;
//# sourceMappingURL=dockerManager.js.map