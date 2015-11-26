/*
 *  Locator.js  Retrieves user location
 */

'use strict';

C.System.Locator = {};

C.System.Locator.getUserPosition = function (callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        callback();
    }
};
