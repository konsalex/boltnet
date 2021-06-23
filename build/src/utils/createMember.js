"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const createMemberOptions = ({ id, baseName, ports, networkName, options, }) => {
    const memberName = `${baseName}-${options.mode
        .toLowerCase()
        .replace('_', '-')}-${id + 1}`;
    console.log(chalk_1.default.black.bgYellow(`  Creating member: ${memberName}`));
    const discoveryMembers = Array.from({ length: options.clusterSize }, (_, i) => `${baseName}-core-${i + 1}:5000`);
    const envinromentVariables = [
        'NEO4J_ACCEPT_LICENSE_AGREEMENT=yes',
        `NEO4J_AUTH=${options.username}/${options.password}`,
        `NEO4J_dbms_mode=${options.mode}`,
        `NEO4J_causal__clustering_initial__discovery__members=${discoveryMembers}`,
        `NEO4J_dbms_connector_bolt_advertised__address=localhost:${ports.container.BOLT}`,
        `NEO4J_dbms_connector_http_advertised__address=localhost:${ports.container.HTTP}`,
    ];
    if (options.mode === 'CORE') {
        envinromentVariables.push(`NEO4J_causal__clustering_expected__core__cluster__size=${options.clusterSize}`);
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
                [`${ports.host.HTTP}/tcp`]: [{ HostPort: ports.container.HTTP }],
                /** HTTPS port */
                [`${ports.host.HTTPS}/tcp`]: [{ HostPort: ports.container.HTTPS }],
                /** Bolt port */
                [`${ports.host.BOLT}/tcp`]: [{ HostPort: ports.container.BOLT }],
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
exports.default = createMemberOptions;
//# sourceMappingURL=createMember.js.map