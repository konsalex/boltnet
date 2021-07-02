import Dockerode from 'dockerode';
import {yellowGappedMessage} from './styling';

type CreateMemberParams = {
  /** The baseName, a random string to distinguise every Boltnet run */
  baseName: string;
  ports: {
    [key in 'container' | 'host']: {
      BOLT: string;
      HTTPS: string;
      HTTP: string;
    };
  };
  options: {
    imageName: string;
    username: string;
    password: string;
  };
};

const createSingleOptions = ({
  baseName,
  ports,
  options,
}: CreateMemberParams): Dockerode.ContainerCreateOptions => {
  const memberName = `${baseName}-single`;

  yellowGappedMessage(`Creating member: ${memberName}`);

  const envinromentVariables = [
    'NEO4J_ACCEPT_LICENSE_AGREEMENT=yes',
    `NEO4J_AUTH=${options.username}/${options.password}`,
    `NEO4J_dbms_connector_bolt_advertised__address=localhost:${ports.container.BOLT}`,
    `NEO4J_dbms_connector_http_advertised__address=localhost:${ports.container.HTTP}`,
  ];

  return {
    Image: options.imageName,
    Tty: false,
    name: memberName,
    Hostname: memberName,
    AttachStdin: false,
    AttachStdout: false,
    AttachStderr: false,
    HostConfig: {
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

export default createSingleOptions;
