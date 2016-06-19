'use strict';

import geolib from 'geolib';

/*
 * Object factory of models representing point on a map
 */

export default function point({name, latitude, longitude, createdAt}) {
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

    function equals(otherPoint) {
        return name === otherPoint.getName() &&
            latitude === otherPoint.getLatitude() &&
            longitude === otherPoint.getLongitude() &&
            createdAt === otherPoint.getCreatedAt();
    }

    function serialize() {
        return {name, latitude, longitude, createdAt};
    }

    function distanceFrom(otherPoint) {
        return geolib.getDistance(
            {latitude, longitude},
            {latitude: otherPoint.getLatitude(), longitude: otherPoint.getLongitude()},
            1
        );
    }

    return {getName, getLatitude, getLongitude, getCreatedAt,
        equals, serialize, distanceFrom};
}