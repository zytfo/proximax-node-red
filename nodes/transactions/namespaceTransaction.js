module.exports = function (RED) {
    function namespace(config) {
        const {RegisterNamespaceTransaction, Deadline, UInt64} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.namespace = config.namespace;
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
                if (validator.namespaceValidate(namespace)) {
                    msg.proximax.transaction = RegisterNamespaceTransaction.createRootNamespace(
                        Deadline.create(),
                        namespace,
                        UInt64.fromUint(node.duration),
                        network
                    );
                    msg.proximax.transactionType = "namespace";
                    node.send(msg);
                } else {
                    node.error("Namespace is incorrect", msg);
                }

            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("namespace", namespace);
};