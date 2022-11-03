// Complete project details: https://randomnerdtutorials.com/esp8266-nodemcu-web-server-websocket-sliders/

var gateway = `ws://192.168.1.22/ws`;
var websocket;
window.addEventListener('load', onload);

function onload(event) {
    initWebSocket();
}

function getValues() {
    websocket.send("getValues");
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
    getValues();
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

const zmianaSliders = document.querySelectorAll(".slider");

function updateSliderPWM(e) {
    var sliderNumber = e.target.id.charAt(e.target.id.length - 1);
    var sliderValue = e.target.value;
    document.getElementById("sliderValue" + sliderNumber).innerHTML = sliderValue;
    console.log(sliderValue);
    websocket.send(sliderNumber + "s" + sliderValue.toString());
}
zmianaSliders.forEach((item) => {
    item.addEventListener("touchmove", updateSliderPWM);
});

zmianaSliders.forEach((item) => {
    item.addEventListener("mousemove", updateSliderPWM);
});

const powrotDoZera = (e) => {
    e.target.value = 0;
    updateSliderPWM(e);
};

zmianaSliders.forEach((item) => {
    item.addEventListener("mouseup", powrotDoZera);
});

zmianaSliders.forEach((item) => {
    item.addEventListener("touchend", powrotDoZera);
});

function onMessage(event) {
    console.log(event.data);
    var myObj = JSON.parse(event.data);
    var keys = Object.keys(myObj);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        document.getElementById(key).innerHTML = myObj[key];
        document.getElementById("slider" + (i + 1).toString()).value = myObj[key];
    }
}



