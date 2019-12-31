module.exports = function (RED) {
    function lockFund(config) {
        const {LockFundsTransaction, Deadline, UInt64, Mosaic, MosaicId} = require('tsjs-xpx-chain-sdk');

        const hundredXpx = new Mosaic(new MosaicId([
            481110499,
            231112638
        ]), UInt64.fromUint(100 * 1000000));

        RED.nodes.createNode(this, config);
        this.lockAmount = config.lockAmount;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;
        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const network = node.network || msg.proximax.network;
                if (msg.proximax.signedTransaction !== "undefined") {
                    msg.proximax.transaction = LockFundsTransaction.create(
                        Deadline.create(),
                        hundredXpx,
                        UInt64.fromUint(480),
                        msg.proximax.signedTransaction,
                        network);
                    msg.proximax.transactionType = "lockFund";
                    node.send(msg);
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("lockFund", lockFund);
};