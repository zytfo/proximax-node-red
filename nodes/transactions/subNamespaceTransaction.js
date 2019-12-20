module.exports = function (RED) {
    function subNamespace(config) {
        const {RegisterNamespaceTransaction, Deadline} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.namespace = config.namespace;
        this.subNamespace = config.subNamespace;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const namespace = node.namespace || msg.proximax.namespace;
                const subNamespace = node.subNamespace || msg.proximax.subNamespace;
                const network = node.network || msg.proximax.network;
                if (validator.namespaceValidate(subNamespace)) {
                    msg.proximax.transaction = RegisterNamespaceTransaction.createSubNamespace(
                        Deadline.create(),
                        subNamespace,
                        namespace,
                        network);
                    msg.proximax.transactionType = "subNamespace";
                    node.send(msg);
                } else {
                    node.error("SubNamespace is incorrect");
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("subNamespace", subNamespace);
};