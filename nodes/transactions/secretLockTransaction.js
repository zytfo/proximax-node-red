module.exports = function (RED) {
    function secretLock(config) {
        const {SecretLockTransaction, Deadline, Mosaic, MosaicId, UInt64, HashType, Address} = require('tsjs-xpx-chain-sdk');
        const {sha3_512} = require('js-sha3');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.secret = config.secret;
        this.namespace = config.namespace;
        this.mosaic = config.mosaic;
        this.hashType = config.hashType;
        this.lockTime = config.lockTime;
        this.network = config.network;
        this.address = config.address;
        this.amount = config.amount;
        this.network = RED.nodes.getNode(config.network).network;
        const node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const mosaic = node.mosaic || msg.proximax.mosaic;
                const secret = node.secret || msg.proximax.secret;
                const address = node.address || msg.proximax.address;
                const network = node.network || msg.proximax.network;

                if (node.hashType === "SHA3_512") {
                    const hashedSecret = sha3_512.create().update(secret).hex();
                    if (validator.addressValidate(address) && validator.mosaicFullNameValidate(mosaic)) {
                        msg.proximax.transaction = SecretLockTransaction.create(
                            Deadline.create(),
                            new Mosaic(new MosaicId(mosaic), UInt64.fromUint(node.amount)),
                            UInt64.fromUint(node.lockTime),
                            HashType[node.hashType],
                            hashedSecret,
                            Address.createFromRawAddress(address),
                            network
                        );
                        msg.proximax.transactionType = "secretLock";
                        node.send(msg);
                    } else if (!validator.addressValidate(address)) {
                        node.error("Address is incorrect", msg)
                    } else {
                        node.error("Mosaic is incorrect", msg)
                    }
                } else {
                    node.error("Hash algorithm is not supported", msg)
                }
            } catch (error) {
                node.error(error);
            }
        });
    }

    RED.nodes.registerType("secretLock", secretLock);
};