module.exports = function (RED) {
    function secretProof(config) {
        const {SecretProofTransaction, Deadline, HashType} = require('tsjs-xpx-chain-sdk');

        RED.nodes.createNode(this, config);
        this.secret = config.secret;
        this.proof = config.proof;
        this.hashType = config.hashType;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;
        String.prototype.toHex = function () {
            return this.split('').map(e => e.charCodeAt().toString(16)).join("");
        };

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const secret = node.secret || msg.proximax.secret;
                const proof = node.proof || msg.proximax.proof;
                const network = node.network || msg.proximax.network;
                msg.proximax.transaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType[node.hashType],
                    secret,
                    proof.toHex(),
                    network
                );
                msg.proximax.transactionType = "secretProof";
                node.send(msg);
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("secretProof", secretProof);
};