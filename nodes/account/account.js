module.exports = function (RED) {
    function account(config) {
        const {Account, PublicAccount} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.privateKey = config.privateKey;
        this.publicKey = config.publicKey;
        this.creationType = config.creationType;
        this.network = RED.nodes.getNode(config.network).network;

        let node = this;

        node.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const network = node.network || msg.proximax.network;
                switch (node.creationType) {
                    case "From private key": {
                        const privateKey = node.privateKey || msg.proximax.privateKey;
                        if (validator.privateKeyValidate(privateKey)) {
                            const account = Account.createFromPrivateKey(privateKey, network);
                            msg.proximax.address = account.address.address;
                            msg.proximax.privateKey = account.privateKey;
                            msg.proximax.publicKey = account.publicKey;
                            node.status({text: account.address.pretty()});
                            node.send(msg);
                        } else if (privateKey) {
                            node.error("Private key is incorrect", msg);
                        } else {
                            node.error("Private key is empty", msg);
                        }
                        break;
                    }
                    case "From public key": {
                        const publicKey = node.publicKey || msg.proximax.publicKey;
                        if (validator.publicKeyValidate(publicKey)) {
                            const publicAccount = PublicAccount.createFromPublicKey(publicKey, network);
                            msg.proximax.address = publicAccount.address.address;
                            msg.proximax.publicKey = publicAccount.publicKey;
                            node.status({text: publicAccount.address.pretty()});
                            node.send(msg);
                        } else if (publzicKey) {
                            node.error("Public key is incorrect", msg);
                        } else {
                            node.error("Public key is empty", msg);
                        }
                        break;
                    }
                    default: {
                        const account = Account.generateNewAccount(network);
                        msg.proximax.address = account.address.address;
                        msg.proximax.privateKey = account.privateKey;
                        msg.proximax.publicKey = account.publicKey;
                        node.status({text: account.address.pretty()});
                        node.send(msg);
                    }
                }
            } catch (error) {
                node.error(error, msg);
            }
        });
        node.on('close', function () {
            node.status({});
        });
    }

    RED.nodes.registerType("account", account);
};