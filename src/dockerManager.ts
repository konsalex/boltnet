import {randomString} from './utils/helpers';
import createMemberOptions from './utils/createMember';
import createSingleOptions from './utils/createSingle';
import chalk from 'chalk';
import Dockerode from 'dockerode';
import ora from 'ora';

type DockerManagerConstructor = {
  type: 'SINGLE' | 'CLUSTER';
  coreClusters?: number;
  readReplicas?: number;
  imageName: string;
  username: string;
  password: string;
};

class DockerManager {
  static dockerDriver = new Dockerode();
  static spinner = ora();

  networkName: string | null;
  coreClusters: number;
  readReplicas: number;
  ignoreInput: boolean;
  baseName: string;
  username: string;
  imageName: string;
  password: string;
  type: 'SINGLE' | 'CLUSTER';
  basePorts: {
    BOLT: string;
    HTTP: string;
    HTTPS: string;
  };

  constructor({
    type,
    coreClusters,
    readReplicas,
    imageName,
    username,
    password,
  }: DockerManagerConstructor) {
    DockerManager.spinner.color = 'green';
    this.type = type;
    this.networkName = null;
    this.username = username;
    this.password = password;
    this.coreClusters = coreClusters || 0;
    this.readReplicas = readReplicas || 0;
    this.imageName = `neo4j:${imageName}`;
    this.ignoreInput = true;
    this.baseName = `boltnet-${randomString(5)}`;
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

  static startSpinner(text: string) {
    DockerManager.spinner.text = text;
    DockerManager.spinner.start();
  }

  static errorMessage(message: string) {
    console.log(chalk.red(message));
  }

  static fatalFail(message: string) {
    DockerManager.failSpinner();
    this.errorMessage(message);
    throw new Error(message);
  }

  /** Remove all the containers generated from boltnet */
  static cleanBoltnetContainers() {
    DockerManager.startSpinner('Removing all boltnet containers');
    this.dockerDriver.listContainers({all: true}, (_, containers) => {
      containers?.forEach(containerInfo => {
        if (
          containerInfo.Names.filter(containerName =>
            new RegExp(/boltnet-/).test(containerName)
          ).length > 0
        ) {
          console.log(
            chalk.green(`Removing Container ID: ${containerInfo.Id}`)
          );
          this.dockerDriver
            .getContainer(containerInfo.Id)
            .remove({force: true});
        }
      });
    });
    DockerManager.successSpinner();
  }

  /** Checks is docker is enabled */
  public async pingDocker() {
    try {
      DockerManager.startSpinner('Connecting with Docker');
      await DockerManager.dockerDriver.ping();
      DockerManager.successSpinner();
    } catch (e) {
      DockerManager.fatalFail(e);
    }
  }

  /** Create a network stack on the default Docker bridge */
  public async createNetwork() {
    this.networkName = `boltnet-${randomString(6)}`;
    DockerManager.startSpinner(
      `Creating Bridge network with name: ${this.networkName}`
    );
    try {
      await DockerManager.dockerDriver.createNetwork({Name: this.networkName});
      DockerManager.successSpinner();
    } catch (e) {
      DockerManager.fatalFail(e);
    }
  }

  /** Prune available unused Docker networks */
  static async pruneNetworks() {
    DockerManager.startSpinner('Removing Unused Networks');
    try {
      await DockerManager.dockerDriver.pruneNetworks();
      DockerManager.successSpinner();
    } catch (e) {
      DockerManager.fatalFail('Could not prune networks');
    }
  }

  /**
   * Checks image local availability
   * If image does not exist, downloads it
   */
  public async checkImage() {
    DockerManager.startSpinner('Checking image local availability');
    try {
      const images = await DockerManager.dockerDriver.listImages();
      DockerManager.successSpinner();

      if (!images.some(i => i.RepoTags.includes(this.imageName))) {
        DockerManager.startSpinner('Downloading New image');

        let downloading = true;

        await DockerManager.dockerDriver.pull(
          this.imageName,
          (error: string | null, stream: NodeJS.ReadableStream) => {
            if (error) DockerManager.fatalFail(error);

            const onFinished = () => {
              //  Ended Download
              downloading = false;
            };
            DockerManager.dockerDriver.modem.followProgress(stream, onFinished);
          }
        );

        /** Check if download have finished every half a second */
        while (true) {
          if (!downloading) break;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        DockerManager.successSpinner();
      }
    } catch (e) {
      DockerManager.fatalFail(e);
    }
  }

  /** Create and run containers */
  public async runCluster() {
    DockerManager.startSpinner('Starting Cluster Members');

    /**  Create Cluster members */
    for (let i = 0, l = this.coreClusters + this.readReplicas; i < l; i += 1) {
      const options = createMemberOptions({
        id: i,
        baseName: this.baseName,
        networkName: this.networkName!,
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
      try {
        const container = await DockerManager.dockerDriver.createContainer(
          options
        );
        await container.start();
      } catch (e) {
        DockerManager.fatalFail(e);
      }
    }
    DockerManager.spinner.succeed();
  }

  /** Create and run containers */
  public async runSingle() {
    DockerManager.startSpinner('Starting Single Members');

    const options = createSingleOptions({
      baseName: this.baseName,
      options: {
        username: this.username,
        password: this.password,
        imageName: this.imageName,
      },
      ports: {
        container: {
          BOLT: this.basePorts.BOLT,
          HTTP: this.basePorts.HTTP,
          HTTPS: this.basePorts.HTTPS,
        },
        host: this.basePorts,
      },
    });

    try {
      const container = await DockerManager.dockerDriver.createContainer(
        options
      );
      await container.start();
      DockerManager.spinner.succeed();
    } catch (e) {
      DockerManager.fatalFail(e);
    }
  }
}

export default DockerManager;
