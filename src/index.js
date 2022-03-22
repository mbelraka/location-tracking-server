// Import config
const MAIN_CONFIG = require('./config/main.config');

// Initialization
const appExpress = require("express")();
const http = require("http").Server(appExpress);
const socket = require("socket.io")(http);

// State
const landmarks = [];

// Socket
socket.on(MAIN_CONFIG.events.connection.token, subscriber => _connectionCallback(subscriber));


// Connect and listen
http.listen(MAIN_CONFIG.port, () => {
    console.log(`Listening on port ${MAIN_CONFIG.port}`);
});


// Private functions

/**
 * A function to emit the landmarks to the new connection device
 * @param subscriber: the new connecting device
 * @private
 */
function _emitLandmarks(subscriber) {
    landmarks.forEach(landmark => subscriber.emit(MAIN_CONFIG.events.landmark.token, landmark));
}

/**
 * The callback of a new landmark
 * @param landmark: the new landmark
 * @private
 */
function _landmarkCallback(landmark) {
    console.log(MAIN_CONFIG.events.landmark.message);
    landmarks.push(landmark);

    socket.emit(MAIN_CONFIG.events.landmark.token, landmark);
}

/**
 * A function to listen to the new connecting devices for new landmarks
 * @param subscriber: the new connecting device
 * @private
 */
function _setLandmarkCallback(subscriber) {
    subscriber.on(MAIN_CONFIG.events.landmark.token, landmark => _landmarkCallback(landmark));
}

/**
 * Callback function on connecting new device
 * @param subscriber: the connecting device
 * @private
 */
function _connectionCallback(subscriber) {
    console.log(MAIN_CONFIG.events.connection.message);

    _emitLandmarks(subscriber);
    _setLandmarkCallback(subscriber);
}
