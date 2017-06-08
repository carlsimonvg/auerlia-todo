
import {expect} from 'chai';
import 'aurelia-polyfills';
import {DomManager} from './../../src/lib/dom-manager';
import {TodoModel} from './../../src/lib/todo-model';
import {ElementMockup} from './../mock/element-mockup';
import './../mock/document-mockup';

describe('DomManager Tests', function() {
    let domManager;
    let element;

    beforeEach(function() {
        createAndAppendElement('orderList', 'unordered-list');
        createAndAppendElement('todoItemInput', 'input');
        createAndAppendElement('search', 'input');

        domManager = new DomManager ("orderList", "todoItemInput", "search");
    });

    function createAndAppendElement(id, type) {
        element = global.document.createElement(type);
        element.id = id;
        global.document.appendChild(element);
    }
    
    it('constructor', function() {
        expect(domManager).to.not.be.null;
    });
    
    it('not constructor', function() {
        expect(() => DomManager()).to.throw("Cannot call a class as a function");
    });

    describe('createLiItem', function() {
        it('create new item values set and created', function() {
            //Arrange
            let value = 'test';
            let model = new TodoModel(value);

            //Act
            let item = domManager.createLiItem(model);

            //Assert
            expect(item.children[0].innerText).to.equal(value);
            expect(item.children[0].id).to.equal(`li${model.id}`);
            expect(item.children[0].style.textDecoration).to.equal(undefined);
            expect(item.children[0].nodeType).to.equal('li');
            expect(item.children[0].children[0].nodeType).to.equal('input');
            expect(item.children[0].children[0].id).to.equal(`li${model.id}_checkbox`);

        });

        it('create new item values set and created', function() {
            //Arrange
            let value = 'test';
            let model = new TodoModel(value);
            model.isComplete = true;

            //Act
            let item = domManager.createLiItem(model);

            //Assert
            expect(item.children[0].innerText).to.equal(value);
            expect(item.children[0].id).to.equal(`li${model.id}`);
            expect(item.children[0].style.textDecoration).to.equal(`line-through`);
            expect(item.children[0].nodeType).to.equal('li');
            expect(item.children[0].children[0].nodeType).to.equal('input');
            expect(item.children[0].children[0].id).to.equal(`li${model.id}_checkbox`);

        });
    });

    describe('addLiItem', function() {
        it('add li item, item added', function() {
            //Arrange
            let value = 'test';
            let model = new TodoModel(value);
            expect(domManager.list.children.length).to.equal(0);

            //Act
            let item = domManager.addLiItem(model);

            //Assert
            expect(domManager.list.children.length).to.equal(1);
        });
    });

    describe('buildListForDisplay', function() {
        beforeEach(function() {
            while(domManager.list.children.length > 0){
                domManager.list.children.pop();
            }
        });

        it('all items added correctly', function() {
            //Arrange
            let modelArray = [new TodoModel('buildItem1'),new TodoModel('buildItem2'),new TodoModel('buildItem3')];
            expect(domManager.list.children.length).to.equal(0);

            let fragment = document.createDocumentFragment();
            fragment.appendChild(document.createElement('li'));
            domManager.list.appendChild(fragment);
            expect(domManager.list.children.length).to.equal(1);

            //Act
            domManager.buildListForDisplay(modelArray);

            //Assert
            expect(domManager.list.children.length).to.equal(3);
        });
    });
})
