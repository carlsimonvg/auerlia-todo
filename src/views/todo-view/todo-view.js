import {DataStore} from './../../lib/data-store';
import {DomManager} from './../../lib/dom-manager';
import {TodoModel} from './../../lib/todo-model';

/**
 * Class that uses the other classes to preform relevant actions
 */
export class TodoView {
    constructor(){
        this.todoListId = "orderList";
        this.todoInputId = "todoItemInput";
        this.searchInputId = "search";

        console.log(document);

        this.datastore = new DataStore("todoItems");
        this.domManager = new DomManager(this.todoListId, this.todoInputId, this.searchInputId, document);
        this.domManager.buildListForDisplay(this.datastore.items);

        this.addTodoItemHandler = this.domManager.registerEvent("addToList", "click", this.addTodoItem.bind(this));
        this.removeCheckedItemsFromListHandler = this.domManager.registerEvent("removeItemsFromList", "click", this.removeCheckedItemsFromList.bind(this));
        this.completeCheckedItemsFromListHandler = this.domManager.registerEvent("completeItems", "click", this.completeCheckedItemsFromList.bind(this));
        this.searchKeyUpHandler = this.domManager.registerEvent("search", "keyup", this.searchKeyUp.bind(this));

        this.comboBoxHandler = this.comboBoxChecked.bind(this);
        this.domManager.list.addEventListener("comboBoxChecked", this.comboBoxHandler, false);
    }

    dispose(){
        this.domManager.unregisterEvent("addToList", "click", this.addTodoItemHandler);
        this.domManager.unregisterEvent("removeItemsFromList", "click", this.removeCheckedItemsFromListHandler);
        this.domManager.unregisterEvent("completeItems", "click", this.completeCheckedItemsFromListHandler);
        this.domManager.unregisterEvent("search", "keyup", this.searchKeyUpHandler);

        this.domManager.list.removeEventListener("comboBoxChecked", this.comboBoxHandler);
        this.comboBoxHandler = null;

        this.datastore.dispose();
        this.datastore = null;
        this.domManager.dispose();
        this.domManager = null;
    }

    /**
     * combobox checked/unchecked event
     * @param args
     */
    comboBoxChecked(args){
        this.datastore.selectItem(args.detail.id, args.detail.isChecked);
    }

    /**
     * trigger filter based on newest value in searchbox
     */
    searchKeyUp(){
        let searchValue = this.domManager.searchInput.value;
        this.domManager.buildListForDisplay(this.datastore.filterItems(searchValue));
    }

    /**
     * Add new Li item based on text in textbox
     */
    addTodoItem(){
        let newToDoValue = this.domManager.todoInput.value;
        let newItem = this.datastore.addItem(new TodoModel(newToDoValue));
        this.domManager.addLiItem(newItem);
    }

    /**
     * loop through checked items and remove them from list
     */
    removeCheckedItemsFromList(){
        let selectedIds = this.datastore.getSelectedItemsIdCollection();
        this.domManager.removeSelectedItems(selectedIds);
        this.datastore.removeSelectedItems();
    }

    /**
     * loop through checked items and complete them from list
     */
    completeCheckedItemsFromList(){
        let selectedIds = this.datastore.getSelectedItemsIdCollection();
        this.domManager.completeSelectedItems(selectedIds);
        this.datastore.completeSelectedItems();
    }
}
