
const request = require('http').request
const Wifi = require("Wifi");

const greenLightPin = 14; //D5;
const redLightPin = 12; //D6;
const blueLightPin = 13;//D7;
const ledBuiltIn = 2;//D7;

const ldrPin = A0;
const minValue = 1;

const URL = 'http://192.168.15.72:1880/lightSensor';
const HOSTNAME = 'lightController'
const WIFI_NAME = "Erick Wendel";
const WIFI_OPTIONS = { password: "" };

function enableExternalAccess(alreadyAP) {
    if (alreadyAP) return;

    Wifi.setHostname(HOSTNAME);
    // timeout(100);
    Wifi.save();
    // timeout(100);
    Wifi.startAP('my-ssid');
    // timeout(100);
    const accessPointIP = Wifi.getAPIP();
    console.log('My access Point is', accessPointIP.ip);
}

function connectWifi(alreadyConnected) {
    if (alreadyConnected) return;
    return new Promise((resolve, reject) => {
        Wifi.connect(WIFI_NAME, WIFI_OPTIONS, (err) => err ? reject(err) : resolve())
    })
    .then(() => Wifi.stopAP())

}

function postJSON(postURL, data) {
    const content = JSON.stringify(data);
    const options = url.parse(postURL);
    options.method = 'POST';
    options.headers = {
        "Content-Type": "application/json",
        "Content-Length": content.length
    };

    return new Promise((resolve, reject) => {

        const req = request(options, function (res) {
            let d = "";
            res.on('data', (data) => d += data);
            res.on('close', resolve);
        });
        req.on('error', reject);
        req.end(content);
    })

}


// function timeout(ms) {
//     const finalDate = Date.now() + ms
//     return () => {
//         console.log('waiting...', ms)
//         while (finalDate >= Date.now()) { }
//     }
// }

function RGBColor(redLightValue, greenLightValue, blueLightValue) {
    analogWrite(redLightPin, redLightValue);
    analogWrite(greenLightPin, greenLightValue);
    analogWrite(blueLightPin, blueLightValue);
}

function handleRBG(isLightOff) {
    if (isLightOff) {
        console.log("Its DARK, Turn on the LED");
        RGBColor(255, 255, 255);
        return;
    }

    console.log("Its BRIGHT, Turn off the LED");
    RGBColor(0, 0, 0);
}

function isLightOff() {
    const ldrStatus = analogRead(ldrPin);
    console.log("ldrStatus:", ldrStatus);
    return ldrStatus == minValue
}

function main() {
    const wifiStatus = Wifi.getStatus()
    const alreadyConnected = wifiStatus.station == "connected";
    const alreadyAP = wifiStatus.ap == "enabled";
    if (wifiStatus.station === 'connecting') {
        console.log('trying to connect to Wifi..')
        digitalWrite(ledBuiltIn, LOW);
        E.reboot()
    }
    else {
        digitalWrite(ledBuiltIn, HIGH);
    }

    Promise.resolve()
        .then(() => connectWifi(alreadyConnected))
        .then(() => console.log('wifi connected! MyIP:', Wifi.getIP().ip))
        .then(() => enableExternalAccess(alreadyAP))
        .then(() => isLightOff())
        .then((isOff) => {
            handleRBG(isOff)
            return isOff
        })
        // no dashboard vai aparecer o estado atual, se está desligado, vai ligar
        .then((isOff) => postJSON(URL, { isLightOff: isOff }))
        // .then((response) => console.log("NodeRed Response: ", response))
        .catch(error => {
            console.log('Deu Ruim', error)
        });

}


const taskId = setInterval(main.bind(this), 200);
function onInit() {
    clearInterval(taskId)
}
save();

// espruino -p tcp://lightController -b 115200 LightRgb.js
// espruino -p "/dev/tty.wchusbserial14620" -b 115200 LightRgb.js
