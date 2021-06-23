import Dockerode from 'dockerode';
declare type CreateMemberParams = {
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
declare const createMemberOptions: ({ id, baseName, ports, networkName, options, }: CreateMemberParams) => Dockerode.ContainerCreateOptions;
export default createMemberOptions;
