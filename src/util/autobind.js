export default function(instance) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(property => {
        if(typeof instance[property] === 'function') {
            instance[property] = instance[property].bind(instance);
        }
    });
}
