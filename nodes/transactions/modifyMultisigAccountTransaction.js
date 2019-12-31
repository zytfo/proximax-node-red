module.exports = function (RED) {
    function modifyMultisigAccount(config) {
        const {ModifyMultisigAccountTransaction, MultisigCosignatoryModification, Deadline} = require('tsjs-xpx-chain-sdk');

        RED.nodes.createNode(this, config);
        let context = this.context().flow;
        this.privateKey = config.privateKey;
        this.minApproval = config.minApproval;
        this.minRemoval = config.minRemoval;
        this.remove = config.remove;
        this.trigger = config.trigger;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;
        context.set(node.id, []);

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const minApproval = node.minApproval || msg.proximax.minApproval;
                const minRemoval = node.minRemoval || msg.proximax.minRemoval;
                const network = node.network || msg.proximax.network;
                let publicAccounts = context.get(node.id) || [];

                if (msg.proximax.publicAccount) {
                    if (node.remove === "true") {
                        publicAccounts = publicAccounts.concat(new MultisigCosignatoryModification(1, msg.proximax.publicAccount));
                    } else {
                        publicAccounts = publicAccounts.concat(new MultisigCosignatoryModification(0, msg.proximax.publicAccount));
                    }
                    context.set(node.id, publicAccounts);
                }
                if (msg.proximax.trigger === node.trigger) {
                    msg.proximax.transaction = ModifyMultisigAccountTransaction.create(
                        Deadline.create(),
                        minApproval,
                        minRemoval,
                        publicAccounts,
                        network
                    );
                    msg.proximax.transactionType = "modifyMultisigAccount";
                    context.set(node.id, []);
                    node.send(msg);
                }

            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("modifyMultisigAccount", modifyMultisigAccount);
};