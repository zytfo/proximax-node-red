# ProximaX Sirius Chain Node-Red Tool

##### A collection of Node-Red nodes for ProximaX blockchain.

## Installation

### Using npm

1. Install Node-Red.

```npm install -g node-red```

2. Install `node-red-contrib-proximax`. 

```npm install node-red-contrib-proximax```

3. Run Node-Eed. 

```node-red```

4. Install ProximaX nodes from palette interface.


### Using git clone
1. Install Node-Red.

```npm install -g node-red```

2. Clone this repository. 

```git clone <url>```

3. Move to cloned repository. 

```cd <cloned repository>```

4. Install dependencies. 

```npm install```

5. Move to Node-Red folder. 

```cd <node-red directory> (e.g. cd ~/.node-red/)```

6. Create a link to the cloned repository. 

```npm install <cloned repository>```

7. Run Node-Eed. 

```node-red```

## Available nodes
#### Account nodes:
1. `account`: create an account from public/private key or generate new account.
2. `accountInfo`: get information about account with account address.
3. `sign`: sign transaction object.
4.  `announce`: announce transaction to the blockchain.

#### Transaction nodes:
1. `transfer`: create transfer transaction.
2. `namespace`: create namespace.
3. `subnamespace`: create subnamespace.
4. `mosaicDefinition`: create mosaic definition transaction.

#### Config node:
`Network`: configure the network with URL and network type.