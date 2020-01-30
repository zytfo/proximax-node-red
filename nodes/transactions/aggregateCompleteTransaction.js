module.exports = function (RED) {
    function aggregateComplete(config) {
        const { AggregateTransaction, PublicAccount, Deadline } = require('tsjs-xpx-chain-sdk');

        RED.nodes.createNode(this, config);
        this.trigger = config.trigger;
        let context = this.context().flow;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;
        context.set(node.id, []);

        this.on('input', function (msg) {
            let sender;
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const publicKey = msg.proximax.publicKey;
                const network = node.network || msg.proximax.network;
                let savedTransactions = context.get(node.id) || [];
                if (msg.proximax.transaction) {
                    sender = PublicAccount.createFromPublicKey(publicKey, network);
                    savedTransactions = savedTransactions.concat(msg.proximax.transaction.toAggregate(sender));
                    context.set(node.id, savedTransactions);
                }
                if (msg.proximax.trigger === node.trigger) {
                    const aggregateTransaction = AggregateTransaction.createComplete(
                        Deadline.create(),
                        savedTransactions,
                        network,
                        []
                    );
                    if (aggregateTransaction.innerTransactions.length !== 0) {
                        msg.proximax.transactionType = "aggregateComplete";
                        msg.proximax.transaction = aggregateTransaction;
                        context.set(node.id, []);
                        node.send(msg);
                    } else {
                        node.error("There are no inner transactions in the aggregateComplete transaction");
                    }
                }
            } catch (error) {
                node.error(error);
            }
        });
    }
    RED.nodes.registerType("aggregateComplete", aggregateComplete);
};