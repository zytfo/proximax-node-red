module.exports = function (RED) {
    function mosaicAlias(config) {
        const {AliasTransaction, Deadline, AliasActionType, NamespaceId, MosaicId} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.namespace = config.namespace;
        this.mosaicId = config.mosaicId;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;
        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const namespace = node.namespace || msg.proximax.namespace;
                const network = node.network || msg.proximax.network;
                const mosaicId = node.mosaicId || msg.proximax.mosaicId;
                if (validator.namespaceFullNameValidate(namespace)) {
                    msg.proximax.transaction = AliasTransaction.createForMosaic(
                        Deadline.create(),
                        AliasActionType.Link,
                        new NamespaceId(namespace),
                        new MosaicId(mosaicId),
                        network);
                    msg.proximax.transactionType = "mosaicAlias";
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

    RED.nodes.registerType("mosaicAlias", mosaicAlias);
};