const privateKeyRegExp = new RegExp("^([0-9A-Fa-f]{2}){32}$");
const publicKeyRegExp = new RegExp("^([0-9A-Fa-f]{2}){32}$");
const addressRegExp = new RegExp("^([0-9a-zA-Z]){40}$|^((([0-9a-zA-Z\-]){7}){6}([0-9a-zA-Z]){4}){1}$");
const hostRegExp = new RegExp("^((http|https):\/\/)[-a-zA-Z0-9@%.\/_\+~#=]+[:]{1}[0-9]+$");
const namespaceFullNameRegExp = new RegExp("^([0-9a-z_\-]{1,64})(\\.[0-9a-z_\-]{1,64}){0,2}$");
const mosaicRegExp = new RegExp("^([0-9a-z_\-]{1,64})$");
const namespaceRegExp = new RegExp("^([0-9a-z_\-]{1,64})$");
const mosaicFullNameRegExp = new RegExp("^([0-9a-z_\-]{1,64})((\\.([0-9a-z_\-]{1,64})){0,2})(:[0-9a-z_\-]{1,64}){1}$");

module.exports = {
    privateKeyRegExp,
    publicKeyRegExp,
    addressRegExp,
    hostRegExp,
    namespaceFullNameRegExp,
    mosaicRegExp,
    namespaceRegExp,
    mosaicFullNameRegExp,

    privateKeyValidate: function (privateKey) {
        return privateKeyRegExp.test(privateKey);
    },
    publicKeyValidate: function (publicKey) {
        return publicKeyRegExp.test(publicKey)
    },
    addressValidate: function (address) {
        return addressRegExp.test(address);
    },
    hostValidate: function (host) {
        return hostRegExp.test(host);
    },
    namespaceFullNameValidate: function (namespaceFullName) {
        return namespaceFullNameRegExp.test(namespaceFullName);
    },
    mosaicValidate: function (mosaic) {
        return mosaicRegExp.test(mosaic)
    },
    namespaceValidate: function (namespace) {
        return namespaceRegExp.test(namespace);
    },
    mosaicFullNameValidate: function (mosaicFullName) {
        return mosaicFullNameRegExp.test(mosaicFullName);
    }
};