export default function makeStorage() {
    const db = {};

    function setItem(key, value) {
        db[key] = value;
    }

    function getItem(key) {
        return db[key];
    }

    function removeItem(key) {
        delete db[key];
    }

    return Object.assign(db, {setItem, getItem, removeItem});
}