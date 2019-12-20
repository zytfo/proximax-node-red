module.exports = function (RED) {
    function announce(config) {
        const {TransactionHttp, Listener, PublicAccount} = require('tsjs-xpx-chain-sdk');

        RED.nodes.createNode(this, config);
        this.host = RED.nodes.getNode(config.network).host;
        this.network = RED.nodes.getNode(config.network).network;
        let node = this;

        const transactionHttp = new TransactionHttp(node.host);

        this.on('input', function (msg) {
            try {
                if (typeof msg.proximax === "undefined") {
                    msg.proximax = {};
                }
                const host = node.host || msg.proximax.host;
                const network = node.network || msg.proximax.network;
                let socket;
                if (host.includes("https")) {
                    socket = host.replace("https", "wss");
                } else {
                    socket = host.replace("http", "ws");
                }
                const listener = new Listener(socket);
                const signedTransaction = msg.proximax.signedTransaction;
                listener.open().then(() => {
                    const subscription = listener.confirmed(PublicAccount.createFromPublicKey(signedTransaction.signer, network).address).subscribe(confirmed => {
                        if (confirmed && confirmed.transactionInfo && confirmed.transactionInfo.hash === signedTransaction.hash) {
                            subscription.unsubscribe();
                            listener.close();
                            msg.proximax.confirmed = confirmed;
                            node.send(msg);
                        }
                    }, error => {
                        node.error(error, msg);
                    });
                    transactionHttp.announce(signedTransaction);
                });
            } catch (error) {
                node.error(error);
            }
        });
        node.on('close', function () {
            node.status({});
        });
    }

    RED.nodes.registerType("announce", announce);
};