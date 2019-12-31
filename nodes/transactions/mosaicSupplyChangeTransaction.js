module.exports = function (RED) {
    function mosaicSupplyChange(config) {
        const {MosaicSupplyChangeTransaction, MosaicId, Deadline, UInt64} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.mosaic = config.mosaic;
        this.amount = config.amount;
        this.direction = config.direction;
        this.network = RED.nodes.getNode(config.network).network;

        let node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const mosaic = node.mosaic || msg.proximax.mosaic;
                const network = node.network || msg.proximax.network;
                if (validator.mosaicFullNameValidate(mosaic)) {
                    const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                        Deadline.create(),
                        new MosaicId(mosaic),
                        node.direction,
                        UInt64.fromUint(node.amount),
                        network);
                    msg.proximax.transactionType = "mosaicSupplyChange";
                    msg.proximax.transaction = mosaicSupplyChangeTransaction;
                    node.send(msg);
                } else {
                    node.error("Mosaic is incorrect", msg)
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("mosaicSupplyChange", mosaicSupplyChange);
};