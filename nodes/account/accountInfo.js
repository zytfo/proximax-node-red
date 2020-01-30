module.exports = function (RED) {
    function accountInfo(config) {
        const {AccountHttp, Address, MosaicHttp, NamespaceHttp, MosaicService} = require('tsjs-xpx-chain-sdk');
        const {mergeMap, map} = require('rxjs/operators');
        const validator = require('../utils/validator');

        RED.nodes.createNode(this, config);
        this.host = RED.nodes.getNode(config.network).host;
        this.address = config.address;
        let node = this;

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const address = node.address || msg.proximax.address;
                const host = node.host || msg.proximax.host;

                if (validator.addressValidate(address) && host) {
                    const accountHttp = new AccountHttp(host);
                    const mosaicHttp = new MosaicHttp(host);
                    const mosaicService = new MosaicService(accountHttp, mosaicHttp);
                    accountHttp
                        .getAccountInfo(Address.createFromRawAddress(address))
                        .subscribe(accountInfo => {
                            msg.proximax.accountInfo = accountInfo;
                            node.status({text: accountInfo.address.pretty()});
                        }, error => {
                            node.status({fill: "red", shape: "ring", text: "ERROR, check debug window"});
                            node.error(error);
                        });
                    mosaicService
                        .mosaicsAmountViewFromAddress(Address.createFromRawAddress(address))
                        .pipe(
                            mergeMap((_) => _)
                        )
                        .subscribe(mosaic => {
                            msg.proximax.relativeAmount = mosaic.relativeAmount();
                            msg.proximax.fullName = mosaic.fullName();
                            node.send(msg);
                        },error => {
                            node.status({fill: "red", shape: "ring", text: "ERROR, check debug window"});
                            node.error(error);
                        });
                } else if (address) {
                    node.error("Address is incorrect", msg);
                } else {
                    node.error("Server is incorrect", msg);
                }
            } catch (error) {
                node.error(error, msg);
            }
        });
        node.on('close', function () {
            node.status({});
        });
    }

    RED.nodes.registerType("accountInfo", accountInfo);
};