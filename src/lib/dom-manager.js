/**
 * Class responsible for manipulating the DOM
 */
export class DomManager {
    constructor(listId, todoId, searchId, document){
        this.listId = listId;
        this.document = document;
        this.list = this.document.getElementById(listId);
        this.todoInput = this.document.getElementById(todoId);
        this.searchInput = this.document.getElementById(searchId);

        console.log(this.list);
        console.log(this.todoInput);
        console.log(this.searchInput);

        this.raiseEventHandler = this.registerEvent(listId, "click", this.raiseEvent.bind(this));
    }

    dispose() {
        this.unregisterEvent(this.listId, "click", this.raiseEventHandler);
        this.list = null;
        this.todoInput = null;
        this.searchInput = null;
    }

    registerEvent(id, event, handler) {
        this.document.getElementById(id).addEventListener(event, handler);
        return handler;
    }

    unregisterEvent(id, event, handler) {
        this.document.getElementById(id).removeEventListener(event, handler);
        handler = null;
    }

    /**
     * remove selected items from DOM
     * @param ids* <li id="li1><input type="checkbox" id="li1_checkbox"
     */
    removeSelectedItems(ids) {
        this.processDomItems(ids, item => this.list.removeChild(item));
    }

    /**
     * complete selected items from DOM
     * @param ids
     */
    completeSelectedItems(ids) {
        this.processDomItems(ids, item => item.style.textDecoration = "line-through");
    }

    /**
     * process dom items
     * @param ids
     * @param callback
     */
    processDomItems(ids, callback) {
        while(ids.length > 0){
            const query = `#li${ids[0]}`;
            let liItem = this.list.querySelector(query);
            callback(liItem);
            ids.shift();
        }
    }

    /**
     * Method to create li item with check box
     */
    createLiItem(newItem){
        let fragment = this.document.createDocumentFragment();

        let item = this.document.createElement("li");
        item.innerText = newItem.value;
        item.id = `li${newItem.id}`;
        if(newItem.isComplete){
            item.style.textDecoration = "line-through";
        }

        let checkbox = this.document.createElement("input");
        checkbox.id = `li${newItem.id}_checkbox`;
        checkbox.type = "checkbox";
        checkbox.className = "check";
        checkbox.checked = newItem.isSelected;

        item.appendChild(checkbox);
        fragment.appendChild(item);

        return fragment;
    }

    /**
     * raise combobox checked event
     * @param event
     */
    raiseEvent(event){
        if(event.target.className == "check") {
            let cusevent = new CustomEvent(
                "comboBoxChecked",
                {
                    detail: {
                        id: event.target.parentNode.id.substr(2),
                        isChecked: event.target.checked
                    },

                    bubbles: true,
                    cancelable: true
                }
            );
            event.target.dispatchEvent(cusevent);
        }
    }

    /**
     * Add new Li item based on text in textbox
     */
    addLiItem(newModel){
        let fragment = this.createLiItem(newModel);
        this.list.appendChild(fragment);
    }

    /**
     * Build unordered list based on data store items (for large lists you would use a checksum, for this size it does not need that complexity)
     */
    buildListForDisplay(items){
        while(this.list.firstChild() ){
            this.list.removeChild(this.list.firstChild());
        }

        for (let i = 0, len = items.length; i < len; i++) {
            let fragment = this.createLiItem(items[i]);
            this.list.appendChild(fragment);
        }
    }
}
