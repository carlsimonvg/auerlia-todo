import {expect, assert} from 'chai';
import {Hello} from './../../src/lib/hello.js';

describe('Hello Tests', function() {
    let instance;

    beforeEach(function() {
        instance = new Hello();
    });

    it('constructor', function() {
        // Assert
        expect(instance).to.not.be.null;
    });

    it('not constructor', function() {
        // Assert
        expect(() => Hello()).to.throw("Cannot call a class as a function");
    });

    it('dispose', function() {
        // Act
        instance.dispose();

        // Assert
        // .. put your code here
    });
});