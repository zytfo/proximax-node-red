module.exports = function (RED) {
    function mosaicDefinition(config) {
        const {MosaicDefinitionTransaction, Deadline, MosaicProperties, UInt64, MosaicNonce, MosaicId, PublicAccount} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.namespace = config.namespace;
        this.supplyMutable = config.supplyMutable;
        this.transferable = config.transferable;
        this.levyMutable = config.levyMutable;
        this.divisibility = config.divisibility;
        this.duration = config.duration;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;
        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const namespace = node.namespace || msg.proximax.namespace;
                const network = node.network || msg.proximax.network;
                const nonce = MosaicNonce.createRandom();
                if (validator.namespaceFullNameValidate(namespace)) {
                    msg.proximax.transaction = MosaicDefinitionTransaction.create(
                        Deadline.create(),
                        nonce,
                        MosaicId.createFromNonce(nonce, PublicAccount.createFromPublicKey(msg.proximax.publicKey, network)),
                        MosaicProperties.create({
                            supplyMutable: node.supplyMutable,
                            transferable: node.transferable,
                            divisibility: node.divisibility,
                            duration: UInt64.fromUint(node.duration),
                        }),
                        network);
                    msg.proximax.transactionType = "mosaicDefinition";
                    node.send(msg);
                } else if (!validator.namespaceFullNameValidate(namespace)) {
                    node.error("Namespace is incorrect", msg);
                } else {
                    node.error("Mosaic is incorrect", msg);
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("mosaicDefinition", mosaicDefinition);
};