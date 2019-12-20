const {NetworkType} = require('tsjs-xpx-chain-sdk');

module.exports = {
    getNetworkType: function (networkType) {
        switch (networkType) {
            case "TEST NET":
                return NetworkType.TEST_NET;
            case "MIJIN":
                return NetworkType.MIJIN;
            case "MIJIN TEST":
                return NetworkType.MIJIN_TEST;
            case "MAIN NET":
                return NetworkType.MAIN_NET;
            default:
                return NetworkType.TEST_NET;
        }
    }
};