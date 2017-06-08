
import {expect} from 'chai';
import 'aurelia-polyfills';
import {TodoModel} from './../../src/lib/todo-model';

describe('TodoModel Tests', function() {
    let todoModel;

    beforeEach(function() {
        todoModel = new TodoModel ('test');
    });
    
    it('constructor', function() {
        expect(todoModel).to.not.be.null;
    });
    
    it('not constructor', function() {
        expect(() => TodoModel()).to.throw("Cannot call a class as a function");
    });

    it('default values set', function(){
        expect(todoModel.id).to.be.equal(0);
        expect(todoModel.isComplete).to.be.equal(false);
        expect(todoModel.isSelected).to.be.equal(false);
        expect(todoModel.value).to.be.equal('test');
    })
})
