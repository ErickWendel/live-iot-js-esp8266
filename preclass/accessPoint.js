// const Wifi = require("Wifi");
// const HOSTNAME = 'lightController';
// const WIFI_NAME = "Erick Wendel";
// const WIFI_OPTIONS = { password: "" };
// const AP_NAME = 'Espruino01';

// function promisify(fn, args) {
//     return new Promise((resolve, reject) => {
//         const cbFn = (err, res) => err ? reject(err) : resolve(res);
//         const finalArgs = args.concat(cbFn);
//         return fn.apply(this, finalArgs);
//     });
// }

// function connectWifi() {
//     return Promise.resolve()
//         .then(() => promisify(Wifi.connect, [WIFI_NAME, WIFI_OPTIONS]))
//         .then(() => console.log('wifi connected! MyIP:', Wifi.getIP().ip));
// }

// function enableExternalAccess() {
//     const setTm = (ms) => new Promise(r => setTimeout(r, ms))
//     return Promise.resolve()
//         .then(() => promisify(Wifi.setHostname, [HOSTNAME]))
//         .then(() => setTm(200))
//         .then(() => Wifi.save())
//         .then(() => setTm(200))
//         .then(() => Wifi.startAP(AP_NAME))
//         .then(() => setTm(200))
//         .then(() => promisify(Wifi.getAPIP, []))
//         .then((accessPointIP) => console.log('My access Point is', accessPointIP.ip));
// }

// function main() {

//     Promise.resolve()
//     .then(() => connectWifi())
//     .then(() => enableExternalAccess())
//     .then(() => console.log('My hostname is:', Wifi.getHostname()))
//     .catch(error => console.log('error', error.stack))
// }
// main()