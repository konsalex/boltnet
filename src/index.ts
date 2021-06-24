#!/usr/bin/env node
/* eslint-disable no-process-exit */
import {NEO4j_DEFAULT_DOCKER_TAG, STARTUP_MESSAGE} from './utils/constants';
import {assertPromise} from './utils/typeGuarding';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import chalk from 'chalk';
import DockerManager from './dockerManager';

console.log(chalk.yellow(STARTUP_MESSAGE));

async function createCluster(manager: DockerManager) {
  await manager.pingDocker();
  await manager.checkImage();
  await manager.createNetwork();
  await manager.runContainers();
}

const argv = yargs(hideBin(process.argv))
  .usage('Usage: boltnet [options]')
  .example(
    'boltnet -i 4.3.1-enterprise',
    `Runs default cluster with neo4j docker image: ${NEO4j_DEFAULT_DOCKER_TAG}`
  )
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
  .option('i', {
    alias: 'image',
    nargs: 1,
    type: 'string',
    default: NEO4j_DEFAULT_DOCKER_TAG,
  })
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright - BoltNet 2021').argv;

/** Typeguard to be sure that argv is not a promise */
assertPromise(!(argv instanceof Promise));

const {prune, c, i, r, x, p, u} = argv;

switch (true) {
  case prune:
    DockerManager.pruneNetworks();
    break;
  case x:
    DockerManager.cleanBoltnetContainers();
    break;
  /** Check if cluster flag was provided  */
  case process.argv.some(r => ['-c', '--cluster'].includes(r)): {
    console.log(
      chalk.black.bgGreen(
        `Creating cluster with: ${c} Core members and ${r} Read Replicas with Neo4j Image ${i}`
      )
    );
    const manager = new DockerManager({
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
    console.log(
      `No arguments are passed, if you cant to create a default cluster pass ${chalk.bgGray(
        '-c'
      )} flag`
    );
}
