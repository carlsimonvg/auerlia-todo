
import {expect, assert} from 'chai';
import  * as sinon from 'sinon';
import 'aurelia-polyfills';
import {DataStore} from './../../src/lib/data-store';
import {TodoModel} from './../../src/lib/todo-model';
import './../mock/storage-mock';

describe('DataStore Tests', function() {
    let dataStore;
    beforeEach(function() {
        dataStore = new DataStore ('storeId');
        dataStore.clearStore();
    });

    afterEach(function() {
    });
    
    it('constructor', function() {
        expect(dataStore).to.not.be.null;
    });
    
    it('not constructor', function() {
        expect(() => DataStore()).to.throw("Cannot call a class as a function");
    });

    describe('getNextId', function() {
        it('returns 1 at default', function() {
            expect(dataStore.getNextId()).to.equal(1);
        });

        it('returns 4 when setting current id to 3', function() {
            dataStore.currentId = 3;
            expect(dataStore.getNextId()).to.equal(4);
        });

        it('returns items length plus one when current id 0', function() {
            dataStore.currentId = 0;
            dataStore.items = [{id: 1}, {id:44}];
            expect(dataStore.getNextId()).to.equal(45);
        });
    });

    describe('getSelectedItemsIdCollection', function() {
        it('none selected returns empty array', function() {
            dataStore.items = [{isSelected:false}, {isSelected:false}];
            expect(dataStore.getSelectedItemsIdCollection()).to.eql([]);
        });

        it('only 1 selected returns single element', function() {
            dataStore.items = [{isSelected:true, id:1}, {isSelected:false, id:4}];
            expect(dataStore.getSelectedItemsIdCollection()).to.eql([1]);
        });

        it('more than 1 selected returns all elements', function() {
            dataStore.items = [{isSelected:true, id:1},
                        {isSelected:true, id:6},
                        {isSelected:false, id:3},
                        {isSelected:false, id:4}];
            expect(dataStore.getSelectedItemsIdCollection()).to.eql([1,6]);
        });
    });

    describe('getIndex', function() {
        it('find id returns index', function() {
            dataStore.items = [{id:1}, {id:7}, {id:11}];
            expect(dataStore.getIndex(7)).to.eql(1);
        });

        it('id not found returns -1', function() {
            dataStore.items = [{id:1}, {id:7}, {id:11}];
            expect(dataStore.getIndex(4)).to.eql(-1);
        });
    });

    describe('getItem', function() {
        it('get Item returns item', function() {
            dataStore.items = [{id:1}, {id:7}, {id:11}];
            expect(dataStore.getItem(7)).to.eql({id:7});
        });

        it('get Item not found returns NaN', function() {
            dataStore.items = [{id:1}, {id:7}, {id:11}];
            expect(dataStore.getItem(4)).to.equal(undefined);
        });
    });

    describe('filterItems', function() {
        it('filter phrase match one item', function() {
            dataStore.items = [{value:'test'}, {value:'fail'}, {value:'one'}];
            expect(dataStore.filterItems('o')).to.eql([{value:'one'}]);
        });

        it('filter phrase match multiple items', function() {
            dataStore.items = [{value:'test'}, {value:'son'}, {value:'one'}];
            expect(dataStore.filterItems('on')).to.eql([{value:'son'},{value:'one'}]);
        });

        it('filter phrase match no items', function() {
            dataStore.items = [{value:'test'}, {value:'son'}, {value:'one'}];
            expect(dataStore.filterItems('ons')).to.eql([]);
        });
    });

    describe('addItem', function() {
        it('add item success', function() {
            //Arrange
            const saveSpy = sinon.spy(dataStore, 'saveStore');
            const todoModel = new TodoModel('test');

            //Act
            dataStore.addItem(todoModel);

            //Assert
            expect(dataStore.items.length).to.equal(1);
            expect(dataStore.items[0]).to.eql(todoModel);
            assert(saveSpy.calledOnce, 'saveStore should be called at least once');
            saveSpy.restore();
        });
    });

    describe('selectItem', function() {
        beforeEach(function() {
            dataStore = new DataStore ('storeId');
            dataStore.clearStore();
        });

        it('item selected when sending true', function() {
            //Arrange
            const saveSpy = sinon.spy(dataStore, 'saveStore');
            const getIndexSpy = sinon.spy(dataStore, 'getIndex');
            const todoModel = new TodoModel('test');
            todoModel.id = 1;
            dataStore.items.push(todoModel);
            console.log(dataStore.items);
            expect(dataStore.items[0].isSelected).to.equal(false);

            //Act
            dataStore.selectItem(1, true);

            //Assert
            expect(dataStore.items[0].isSelected).to.equal(true);
            assert(getIndexSpy.calledOnce, 'getIndexSpy should be called at least once');
            assert(saveSpy.calledOnce, 'saveStore should be called at least once');
            saveSpy.restore();
        });

        it('item deselected when sending false', function() {
            //Arrange
            const saveSpy = sinon.spy(dataStore, 'saveStore');
            const getIndexSpy = sinon.spy(dataStore, 'getIndex');
            const todoModel = new TodoModel('test');
            todoModel.id = 1;
            todoModel.isSelected = true;
            dataStore.items.push(todoModel);
            expect(dataStore.items[0].isSelected).to.equal(true);

            //Act
            dataStore.selectItem(1, false);

            //Assert
            expect(dataStore.items[0].isSelected).to.equal(false);
            assert(getIndexSpy.calledOnce, 'getIndexSpy should be called at least once');
            assert(saveSpy.calledOnce, 'saveStore should be called at least once');
            saveSpy.restore();
        });

        it('item not found save store not called', function() {
            //Arrange
            const saveSpy = sinon.spy(dataStore, 'saveStore');
            const getIndexSpy = sinon.spy(dataStore, 'getIndex');
            const todoModel = new TodoModel('test');
            todoModel.id = 2;
            dataStore.items.push(todoModel);
            expect(dataStore.items[0].isSelected).to.equal(false);

            console.log(dataStore.items);
            //Act
            dataStore.selectItem(1, true);

            //Assert
            expect(dataStore.items[0].isSelected).to.equal(false);
            assert(getIndexSpy.calledOnce, 'getIndexSpy should be called at least once');
            expect(saveSpy.callCount).to.equal(0);
            saveSpy.restore();
        });
    });

    describe('completeSelectedItems', function() {
        beforeEach(function() {
            dataStore = new DataStore ('storeId');
            dataStore.clearStore();
        });

        it('one item completed', function() {
            //Arrange
            addItemToDataStore(0, 'test', true);

            //Act
            dataStore.completeSelectedItems();

            //Assert
            expect(dataStore.items[0].isComplete).to.equal(true);
        });

        it('multiple items completed', function() {
            //Arrange
            addItemToDataStore(0, 'test', true);
            addItemToDataStore(1, 'test', true);

            //Act
            dataStore.completeSelectedItems();

            //Assert
            expect(dataStore.items[0].isComplete).to.equal(true);
            expect(dataStore.items[1].isComplete).to.equal(true);
        });

        it('only selected items completed', function() {
            //Arrange
            addItemToDataStore(0, 'test', false);
            addItemToDataStore(1, 'test', true);

            //Act
            dataStore.completeSelectedItems();

            //Assert
            expect(dataStore.items[0].isComplete).to.equal(false);
            expect(dataStore.items[1].isComplete).to.equal(true);
        });
    });

    describe('removeSelectedItems', function() {
        beforeEach(function() {
            dataStore = new DataStore ('storeId');
            dataStore.clearStore();
        });

        it('one item removed', function() {
            //Arrange
            addItemToDataStore(0, 'test', true);
            expect(dataStore.items.length).to.equal(1);

            //Act
            dataStore.removeSelectedItems();

            //Assert
            expect(dataStore.items.length).to.equal(0);
        });

        it('multiple items removed', function() {
            //Arrange
            addItemToDataStore(0, 'test', true);
            addItemToDataStore(1, 'test', true);
            expect(dataStore.items.length).to.equal(2);

            //Act
            dataStore.removeSelectedItems();

            //Assert
            expect(dataStore.items.length).to.equal(0);
        });

        it('only selected items removed', function() {
            //Arrange
            addItemToDataStore(0, 'test', false);
            addItemToDataStore(1, 'test', true);
            expect(dataStore.items.length).to.equal(2);

            //Act
            dataStore.removeSelectedItems();

            //Assert
            expect(dataStore.items.length).to.equal(1);
        });
    });

    function addItemToDataStore(id = 0, value = 'test', isSelected = false, isCompleted = false){
        const todoModel = new TodoModel(value);
        todoModel.isSelected = isSelected;
        todoModel.isComplete = isCompleted;
        todoModel.id = id;
        dataStore.items.push(todoModel);
    }
})
