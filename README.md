<div style="width:100%;text-align:center" >
    <img src="./assets/logo.png" style="margin-left:auto;width:50%;">
</div>

[![GitHub Action NPM Test & Release](https://github.com/konsalex/boltnet/actions/workflows/semantic-release.yml/badge.svg)](https://github.com/konsalex/boltnet/actions/workflows/semantic-release.yml)
![npm](https://img.shields.io/npm/v/boltnet?color=green)
![NPM](https://img.shields.io/npm/l/boltnet)

---

<!-- toc -->

- [🗒 Description](#-description)
- [🚀 Installing](#-installing)
- [🔨 Usage](#-usage)
- [📣 Feedback](#-feedback)
<!-- tocstop -->

# 🗒 Description

This is a unofficial NodeJS CLI for managing Neo4j Cluster with Docker. Behind the curtains [Dockerode](https://github.com/apocas/dockerode) is used to orchestrate all the necessary operations.

If you want to know more about Neo4j Clusters, please check [here](https://neo4j.com/docs/operations-manual/current/clustering/).

**Boltnet** is not intended for production usage, rather than for automated testing 🤖

# 🚀 Installing

To install this as a global package use the below command

```bash
# NPM
npm install -g boltnet
# Yarn
yarn global add boltnet
```

# 🔨 Usage

<!-- Usages -->

- [🔘 Create Cluster](#create-cluster)
- [✂️ Prune Networks](#prune-networks)
- [🏺 Detete Boltnet Containers](#detete-boltnet-containers)

<br/>

The best way to start using **boltnet** is to execute `boltnet --help`.

```
Usage: boltnet [options]

Options:
      --version        Show version number                             [boolean]
      --prune                                         [boolean] [default: false]
  -x, --remove         Removes all boltnet created container           [boolean]
  -c, --cluster        Creates a neo4j cluster with a default of 3 Core members
                                                           [number] [default: 3]
  -r, --read-replica   Sets read replicas to the initial cluster
                                                           [number] [default: 0]
  -u, --user-name      Set username for the authentication
                                                     [string] [default: "neo4j"]
  -p, --user-password  Set password for the authentication
                                               [string] [default: "newpassword"]
  -i, --image                               [string] [default: "4.3-enterprise"]
  -h, --help           Show help                                       [boolean]
```

Main functionalities include:

## Create Cluster

```bash
# Create a cluster with default settings
# 3 Core members, 0 Read replicas, Username/Password: neo4j/newpassword , Neo4j Image: 4.3-enterprise
boltnet -c

# Create a cluster with custom settings
# 4 Core members, 2 Read replicas, Username/Password: random/randompass , Neo4j Image: 4.0.1-enterprise
boltnet -c 4 -r 2 -u random -p randompass -i 4.0.1-enterprise
```

## Prune Networks

Every time a cluster is created, there is also a bridge network created for the cluster members to communicate with each other.

You can prune unused networks:

```bash
boltnet --prune
```

## Detete Boltnet Containers

To delete all running/created **boltnet** containers run:

```bash
boltnet --x
```

# 📣 Feedback

If you have any suggestions or want a more advanced feature on **boltnet**, feel free to open an issue.
