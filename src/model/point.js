'use strict';

import geolib from 'geolib';

/*
 * Object factory of models representing point on a map
 */

export default function point({name, latitude, longitude, createdAt = Date.now(), chosenForNavigation = false}) {
    const instance = {getName, getLatitude, getLongitude, getCreatedAt,
        equals, uniqueKey, serialize, distanceFrom,
        isChosenForNavigation, chooseForNavigation, disregardForNavigation};

    function getName() {
        return name;
    }

    function getLatitude() {
        return latitude;
    }

    function getLongitude() {
        return longitude;
    }

    function getCreatedAt() {
        return createdAt;
    }

    function isChosenForNavigation() {
        return !!chosenForNavigation;
    }

    function chooseForNavigation() {
        if(isChosenForNavigation()) return instance;
        const serialized = serialize();
        serialized.chosenForNavigation = true;
        return point(serialized);
    }

    function disregardForNavigation() {
        if(!isChosenForNavigation()) return instance;
        const serialized = serialize();
        serialized.chosenForNavigation = false;
        return point(serialized);
    }

    function equals(otherPoint) {
        return getName() === otherPoint.getName() &&
            getLatitude() === otherPoint.getLatitude() &&
            getLongitude() === otherPoint.getLongitude() &&
            getCreatedAt() === otherPoint.getCreatedAt() &&
            isChosenForNavigation() == otherPoint.isChosenForNavigation();
    }

    function uniqueKey() {
        return `${getLatitude()}|${getLatitude()}|${getCreatedAt()}`;
    }

    function serialize() {
        return {name, latitude, longitude, createdAt, chosenForNavigation};
    }

    function distanceFrom(otherPoint) {
        return geolib.getDistance(
            {latitude, longitude},
            {latitude: otherPoint.getLatitude(), longitude: otherPoint.getLongitude()},
            1
        );
    }

    return instance;
}