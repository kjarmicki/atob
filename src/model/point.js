import geolib from 'geolib';

/*
 * Object factory of models representing point on a map
 */

function point({name, latitude, longitude, accuracy, createdAt = Date.now(), chosenForNavigation = false}) {
    const instance = {getName, getLatitude, getLongitude, getAccuracy, getCreatedAt,
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

    function getAccuracy() {
        return accuracy;
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
            getAccuracy() === otherPoint.getAccuracy() &&
            isChosenForNavigation() == otherPoint.isChosenForNavigation();
    }

    function uniqueKey() {
        return `${getLatitude()}|${getLatitude()}|${getCreatedAt()}`;
    }

    function serialize() {
        return {name, latitude, longitude, accuracy, createdAt, chosenForNavigation};
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

point.validate = function(data) {
    if(!data.name) {
        throw new Error('Point should have a name');
    }
};

export default point;