module.exports = function (RED) {
    function aggregateBonded(config) {
        const { AggregateTransaction, PublicAccount, Deadline } = require('tsjs-xpx-chain-sdk');

        RED.nodes.createNode(this, config);
        let context = this.context().flow;
        this.network = RED.nodes.getNode(config.network).network;
        this.trigger = config.trigger;
        let account = "";
        const node = this;
        context.set(node.id, []);

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const publicKey = msg.proximax.publicKey;
                const network = node.network || msg.proximax.network;
                let savedTransactions = context.get(node.id) || [];
                if (!account && msg.proximax.account) {
                    account = msg.proximax.account;
                }
                if (msg.proximax.transaction) {
                    const senderInfo = PublicAccount.createFromPublicKey(publicKey, network);
                    savedTransactions = savedTransactions.concat(msg.proximax.transaction.toAggregate(senderInfo));
                    context.set(node.id, savedTransactions);
                }
                if (msg.proximax.trigger === node.trigger) {
                    const aggregateTransaction = AggregateTransaction.createBonded(
                        Deadline.create(),
                        savedTransactions,
                        network,
                        []
                    );
                    if (aggregateTransaction.innerTransactions.length !== 0) {
                        msg.proximax.transaction = aggregateTransaction;
                        msg.proximax.transactionType = "aggregateBonded";
                        msg.proximax.account = account;
                        context.set(node.id, []);
                        account = "";
                        node.send(msg);
                    }
                    else {
                        node.error("There are no inner transactions in the aggregateBonded transaction");
                    }
                }
            } catch (error) {
                node.error(error);
            }
        });
    }
    RED.nodes.registerType("aggregateBonded", aggregateBonded);
};