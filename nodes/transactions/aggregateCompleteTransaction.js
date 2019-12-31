module.exports = function (RED) {
    function aggregateComplete(config) {
        const { AggregateTransaction, PublicAccount, NetworkType, Deadline } = require('tsjs-xpx-chain-sdk');

        RED.nodes.createNode(this, config);
        let context = this.context().flow;
        this.trigger = config.trigger;
        this.network = RED.nodes.getNode(config.network).network;
        let account = "";
        const node = this;
        context.set(node.id, []);

        this.on('input', function (msg) {
            let publicAccount;
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
                    publicAccount = PublicAccount.createFromPublicKey(publicKey, network);
                    savedTransactions = savedTransactions.concat(msg.proximax.transaction.toAggregate(publicAccount));
                    context.set(node.id, savedTransactions);
                }
                if (msg.proximax.trigger === node.trigger) {
                    const aggregateTransaction = AggregateTransaction.createComplete(
                        Deadline.create(),
                        savedTransactions,
                        NetworkType[network],
                        []
                    );
                    if (aggregateTransaction.innerTransactions.length !== 0) {
                        msg.proximax.transactionType = "aggregateComplete";
                        msg.proximax.transaction = aggregateTransaction;
                        msg.proximax.account = account;
                        context.set(node.id, []);
                        account = "";
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