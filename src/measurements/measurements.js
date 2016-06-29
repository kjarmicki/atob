'use strict';

export default {
    coordsToPx(coords, area) {
        const x = (area.width/360) * (180 + coords.longitude);
        const y = (area.height/180) * (90 - coords.latitude);

        return {x, y};
    }
};