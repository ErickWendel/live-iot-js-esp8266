
const request = require('http').request;
const Wifi = require("Wifi");

const greenLightPin = 14; //D5;
const redLightPin = 12; //D6;
const blueLightPin = 13;//D7;
const ledBuiltIn = 2;//D7;

const ldrPin = A0;
const minValue = 1;

const URL = 'http://192.168.15.72:1880/lightSensor';
const WIFI_NAME = "Erick Wendel";
const WIFI_OPTIONS = { password: "" };


function promisify(fn, args) {
    return new Promise((resolve, reject) => {
        const cbFn = (err, res) => err ? reject(err) : resolve(res);
        const finalArgs = args.concat(cbFn);
        return fn.apply(this, finalArgs);
    });
}

function connectWifi(alreadyConnected) {
    if (alreadyConnected) return;
    return Promise.resolve()
        .then(() => promisify(Wifi.connect, [WIFI_NAME, WIFI_OPTIONS]))
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
    });

}


function timeout(ms) {
    const finalDate = Date.now() + ms;
    return () => {
        console.log('waiting...', ms);
        while (finalDate >= Date.now()) { }
    };
}

function RGBColor(redLightValue, greenLightValue, blueLightValue) {
    analogWrite(redLightPin, redLightValue);
    analogWrite(greenLightPin, greenLightValue);
    analogWrite(blueLightPin, blueLightValue);
}

function handleRBG(isLightOff) {
    if (isLightOff) {
        // console.log("Its DARK, Turn on the LED");
        RGBColor(255, 255, 255);
        return;
    }

    // console.log("Its BRIGHT, Turn off the LED");
    RGBColor(0, 0, 0);
}

function isLightOff() {
    const ldrStatus = analogRead(ldrPin);
    console.log("ldrStatus:", ldrStatus);
    return ldrStatus == minValue;
}

function main() {
    const wifiStatus = Wifi.getStatus();
    const alreadyConnected = wifiStatus.station == "connected";
    if (wifiStatus.station === 'connecting') {
        console.log('trying to connect to Wifi..');
        digitalWrite(ledBuiltIn, LOW);
        return;
    }
    else {
        digitalWrite(ledBuiltIn, HIGH);
    }

    return Promise.resolve()
        .then(() => connectWifi(alreadyConnected))
        .then(() => console.log('MyIP:', Wifi.getIP().ip))
        .then(() => isLightOff())
        .then((isOff) => {
            handleRBG(isOff);
            return isOff;
        })
        .then((isOff) => postJSON(URL, { isLightOff: isOff }))
        // .then((response) => console.log("NodeRed Response: ", response))
        .catch(error => {
            console.log('Deu Ruim', error);
            console.log('Deu Ruim', error.stack);
        });

}
setInterval(() => main(), 200);
// fica na memória flash (quando reboota ele não perde os dados)
save();

/*
 espruino -p "/dev/tty.wchusbserial14620" --board "ESP8266_4MB" LightRgb.js
 espruino -p "/dev/tty.wchusbserial14620" -b 115200 LightRgb.js
 espruino -p tcp://192.168.15.82 -b 115200 LightRgb.js
 */
