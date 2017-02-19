import tape from 'tape';
import autobind from '../../src/util/autobind';

class TestClass {
    constructor() {
        this.prop = 'instance property';
        autobind(this);
    }
    method() {
        return this && this.prop === 'instance property';
    }
}

tape.only('autobind function should bind methods to object', t => {
    // given
    const instance = new TestClass();
    const method = instance.method;

    // when
    const result = method();

    // then
    t.true(result);
    t.end();
});
