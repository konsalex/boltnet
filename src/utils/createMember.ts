import chalk from 'chalk';
import Dockerode from 'dockerode';

type CreateMemberParams = {
  baseName: string;
  id: number;
  networkName: string;
  ports: {
    [key in 'container' | 'host']: {
      BOLT: string;
      HTTPS: string;
      HTTP: string;
    };
  };
  options: {
    mode: 'CORE' | 'READ_REPLICA';
    clusterSize: number;
    imageName: string;
    username: string;
    password: string;
  };
};

const createMemberOptions = ({
  id,
  baseName,
  ports,
  networkName,
  options,
}: CreateMemberParams): Dockerode.ContainerCreateOptions => {
  const memberName = `${baseName}-${options.mode
    .toLowerCase()
    .replace('_', '-')}-${id + 1}`;

  console.log(chalk.black.bgYellow(`  Creating member: ${memberName}`));

  const discoveryMembers = Array.from(
    {length: options.clusterSize},
    (_, i) => `${baseName}-core-${i + 1}:5000`
  );

  const envinromentVariables = [
    'NEO4J_ACCEPT_LICENSE_AGREEMENT=yes',
    `NEO4J_AUTH=${options.username}/${options.password}`,
    `NEO4J_dbms_mode=${options.mode}`,
    `NEO4J_causal__clustering_initial__discovery__members=${discoveryMembers}`,
    `NEO4J_dbms_connector_bolt_advertised__address=localhost:${ports.container.BOLT}`,
    `NEO4J_dbms_connector_http_advertised__address=localhost:${ports.container.HTTP}`,
  ];

  if (options.mode === 'CORE') {
    envinromentVariables.push(
      `NEO4J_causal__clustering_expected__core__cluster__size=${options.clusterSize}`
    );
  }

  return {
    Image: options.imageName,
    Tty: false,
    name: memberName,
    Hostname: memberName,
    AttachStdin: false,
    AttachStdout: false,
    AttachStderr: false,
    HostConfig: {
      NetworkMode: networkName,
      PortBindings: {
        /** HTTP port */
        [`${ports.host.HTTP}/tcp`]: [{HostPort: ports.container.HTTP}],
        /** HTTPS port */
        [`${ports.host.HTTPS}/tcp`]: [{HostPort: ports.container.HTTPS}],
        /** Bolt port */
        [`${ports.host.BOLT}/tcp`]: [{HostPort: ports.container.BOLT}],
      },
      /** Replicate Docker run, because RR are not visible by the cluster */
      RestartPolicy: {
        Name: 'no',
      },
      Dns: [],
      DnsOptions: [],
      DnsSearch: [],
      BlkioWeightDevice: [],
      Devices: [],
    },
    Env: envinromentVariables,
  };
};

export default createMemberOptions;
