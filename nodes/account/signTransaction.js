module.exports = function (RED) {
    function sign(config) {
        const {Account, BlockHttp} = require('tsjs-xpx-chain-sdk');
        const networkTypeSelector = require('../utils/networkTypeSelector');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.network = RED.nodes.getNode(config.network).network;
        this.privateKey = config.privateKey;
        this.host = RED.nodes.getNode(config.network).host;

        let node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const privateKey = node.privateKey || msg.proximax.privateKey || (msg.proximax.account && msg.proximax.account.keyPair ? msg.proximax.account.keyPair.privateKey : undefined);
                const network = node.network || msg.proximax.network;
                const host = node.host || msg.proximax.host;
                const account = validator.privateKeyValidate(privateKey) ? Account.createFromPrivateKey(privateKey, network) : undefined;
                const blockHttp = new BlockHttp(host);
                if (account) {
                    if (msg.proximax.hasOwnProperty("transaction")) {
                        blockHttp
                            .getBlockByHeight(1)
                            .subscribe(blockInfo => {
                                msg.proximax.signedTransaction = account.sign(msg.proximax.transaction, blockInfo.generationHash);
                                node.send(msg);
                            }, error => {
                                node.error(error, msg);
                            });
                    } else {
                        node.error("Something went wrong with transaction", msg);
                    }
                } else if (privateKey) {
                    node.error("Private key is incorrect", msg);
                } else {
                    node.error("Private key is empty", msg);
                }
            } catch (error) {
                node.error(error, msg);
            }
            node.on('close', function () {
                node.status({});
            });
        });
    }

    RED.nodes.registerType("sign", sign);
};