module.exports = function (RED) {
    function network(n) {
        const validator = require('../utils/validator');
        const networkTypeSelector = require('../utils/networkTypeSelector');

        RED.nodes.createNode(this, n);
        this.network = networkTypeSelector.getNetworkType(n.network);
        this.url = n.url;
        this.host = n.url + ":" + n.port;
        if (!validator.hostValidate(this.host)) {
            this.error("Network configuration is incorrect");
        }
    }

    RED.nodes.registerType("network", network);
};