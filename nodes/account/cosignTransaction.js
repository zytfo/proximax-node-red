module.exports = function (RED) {
    function cosignature(config) {
        const {CosignatureTransaction, TransactionType} = require('tsjs-xpx-chain-sdk');
        
        RED.nodes.createNode(this, config);
        const node = this;
        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                if (msg.proximax.hasOwnProperty("transaction") && msg.proximax.transaction.type === TransactionType.AGGREGATE_BONDED) {
                    msg.proximax.transaction = CosignatureTransaction.create(msg.proximax.transaction);
                    msg.proximax.transactionType = "cosignature";
                    node.send(msg);
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("cosignature", cosignature);
};