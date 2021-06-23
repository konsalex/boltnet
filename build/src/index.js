#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-process-exit */
const constants_1 = require("./utils/constants");
const typeGuarding_1 = require("./utils/typeGuarding");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const chalk_1 = __importDefault(require("chalk"));
const dockerManager_1 = __importDefault(require("./dockerManager"));
console.log(chalk_1.default.yellow(constants_1.STARTUP_MESSAGE));
async function createCluster(manager) {
    await manager.pingDocker();
    await manager.createNetwork();
    await manager.runContainers();
}
const argv = yargs_1.default(helpers_1.hideBin(process.argv))
    .usage('Usage: boltnet [options]')
    .example('boltnet -i 4.3.1-enterprise', `Runs default cluster with neo4j docker image: ${constants_1.NEO4j_DEFAULT_DOCKER_TAG}`)
    .option('prune', {
    type: 'boolean',
    default: false,
})
    .option('x', {
    alias: 'remove',
    description: 'Removes all boltnet created container',
    type: 'boolean',
    nargs: 0,
})
    .option('c', {
    alias: 'cluster',
    description: 'Creates a neo4j cluster with a default of 3 Core members',
    type: 'number',
    default: 3,
})
    .option('r', {
    alias: 'read-replica',
    description: 'Sets read replicas to the initial cluster',
    type: 'number',
    default: 0,
})
    .option('u', {
    alias: 'user-name',
    description: 'Set username for the authentication',
    type: 'string',
    default: 'neo4j',
})
    .option('p', {
    alias: 'user-password',
    description: 'Set password for the authentication',
    type: 'string',
    default: 'newpassword',
})
    .option('', {
    alias: 'user-name',
    description: 'Set username for the authentication',
    type: 'string',
    default: 'newpassword',
})
    .option('i', {
    alias: 'image',
    nargs: 1,
    type: 'string',
    default: constants_1.NEO4j_DEFAULT_DOCKER_TAG,
})
    .help('h')
    .alias('h', 'help')
    .epilog('Copyright - BoltNet 2021').argv;
/** Typeguard to be sure that argv is not a promise */
typeGuarding_1.assertPromise(!(argv instanceof Promise));
const { prune, c, i, r, x, p, u } = argv;
switch (true) {
    case prune:
        dockerManager_1.default.pruneNetworks();
        break;
    case x:
        dockerManager_1.default.cleanBoltnetContainers();
        break;
    /** Check if cluster flag was provided  */
    case process.argv.some(r => ['-c', '--cluster'].includes(r)): {
        console.log(chalk_1.default.black.bgGreen(`Creating cluster with: ${c} Core members and ${r} Read Replicas with Neo4j Image ${i}`));
        const manager = new dockerManager_1.default({
            coreClusters: c,
            imageName: i,
            readReplicas: r,
            password: p,
            username: u,
        });
        createCluster(manager);
        break;
    }
    default:
        /** No action defined */
        console.log(`No arguments are passed, if you cant to create a default cluster pass ${chalk_1.default.bgGray('-c')} flag`);
}
//# sourceMappingURL=index.js.map