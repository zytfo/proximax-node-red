module.exports = function (RED) {
    function transfer(config) {
        const {TransferTransaction, Deadline, Address, Mosaic, UInt64, PlainMessage, NamespaceId} = require('tsjs-xpx-chain-sdk');
        const validator = require('../utils/validator');
        const _ = require('lodash');

        RED.nodes.createNode(this, config);
        this.recipient = config.recipient;
        this.message = config.message;
        this.mosaics = config.mosaics;
        this.publicKey = config.publicKey;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const address = node.recipient || msg.proximax.recipient || msg.proximax.address || "";
                const message = node.message || msg.proximax.message || "";
                const mosaics = _.isEmpty(node.mosaics) ? msg.proximax.mosaics : node.mosaics;
                const publicKey = node.publicKey || msg.proximax.publicKey;
                const network = node.network || msg.proximax.network;
                let mosaicList = [];
                if (mosaics) {
                    for (let mosaic in mosaics) {
                        if (!mosaics.hasOwnProperty(mosaic)) {
                            continue;
                        }
                        mosaicList.push(new Mosaic(new NamespaceId(mosaic), UInt64.fromUint(mosaics[mosaic] || 0)));
                    }
                }
                if (validator.addressValidate(address)) {
                    const transferTransaction = TransferTransaction.create(
                        Deadline.create(),
                        Address.createFromRawAddress(address),
                        mosaicList,
                        PlainMessage.create(message),
                        network);
                    msg.proximax.transactionType = "transfer";
                    msg.proximax.transaction = transferTransaction;
                    msg.proximax.publicKey = publicKey;
                    node.send(msg);
                } else if (!validator.addressValidate(address)) {
                    node.error("Address is incorrect", msg)
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("transfer", transfer);
};