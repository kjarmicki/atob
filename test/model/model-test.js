import tape from 'tape';
import pointModel from '../../src/model/point';

tape('point model should correctly calculate distance between two points', t => {
    // given
    const pointA = pointModel({
        name: 'a',
        latitude: 49.596582,
        longitude: 20.075843,
        createdAt: 0
    });
    const pointB = pointModel({
        name: 'b',
        latitude: 49.597361,
        longitude: 20.074148,
        createdAt: 0
    });

    // when
    const distance = pointA.distanceFrom(pointB);

    // then
    t.equal(distance, 150);
    t.end();
});

tape('point model should clone itself when chosen for navigation', t => {
    // given
    const point = pointModel({
        name: 'a',
        latitude: 49.596582,
        longitude: 20.075843,
        createdAt: 0
    });

    // when
    const chosenPoint = point.chooseForNavigation();

    // then
    t.false(point === chosenPoint, 'points refer to different instances');
    t.equal(point.getName(), chosenPoint.getName());
    t.equal(point.getLatitude(), chosenPoint.getLatitude());
    t.equal(point.getLongitude(), chosenPoint.getLongitude());
    t.equal(point.getCreatedAt(), chosenPoint.getCreatedAt());
    t.false(point.isChosenForNavigation());
    t.true(chosenPoint.isChosenForNavigation());
    t.end();
});