/**
 * Class responsible for saving and retrieving data from local storage.
 */
export class DataStore {
    constructor(storeId) {
        this.storeId = storeId;
        this.items = this.loadStore();
        this.currentId = 0;
    }

    /**
     * Manage the id system and give me the next id when requested
     */
    getNextId() {
        if(this.currentId == 0 && this.items.length > 0) {
            this.currentId = this.items[this.items.length - 1].id;
        }

        this.currentId++;
        return this.currentId;
    }

    /**
     * On startup if I exist load me
     */
    loadStore() {
        let storeItem = localStorage.getItem(this.storeId);
        if(storeItem === null){
            return [];
        }
        return JSON.parse(storeItem);
    }

    /**
     * Save store
     */
    saveStore() {
        return localStorage.setItem(this.storeId, JSON.stringify(this.items));
    }

    clearStore() {
        localStorage.clear();
    }

    /**
     * get items in data store that are selected
     * @returns {Array}
     */
    getSelectedItemsIdCollection() {
        return this.items.filter(item => item.isSelected).map(item => item.id);
    }

    /**
     * add new item to datastore
     * */
    addItem(model) {
        model.id = this.getNextId();
        this.items.push(model);
        this.saveStore();

        return model;
    }

    /**
     * remove selected items from data store
     */
    removeSelectedItems() {
        this.processSelectedItems(index => this.items.splice(index, 1));
    }

    /**
     * complete selected items from data store
     */
    completeSelectedItems() {
        this.processSelectedItems(index => this.items[index].isComplete = true);
    }

    /**
     * process selected items
     * @param callback
     */
    processSelectedItems(callback){
        let selectedItems = this.getSelectedItemsIdCollection();
        for(let i = 0; i < selectedItems.length; i++){
            let index = this.items.findIndex(el => el.id === selectedItems[i]);
            if(index > -1) {
                callback(index);
            }
        }
        this.saveStore();
    }

    /**
     * mark item as selected or deselected
     * @param id
     * @param isSelected
     */
    selectItem(id, isSelected){
        const index = this.getIndex(id);
        if(index > -1){
            this.items[index].isSelected = isSelected;
            this.saveStore();
        }
    }

    /**
     * return index of id
     * @param id
     * @returns {number}
     */
    getIndex(id){
        return this.items.findIndex(el => el.id == id);
    }

    /**
     * find and return stored item
     * @param id
     * @returns {*}
     */
    getItem(id) {
        return this.items.find(el => el.id == id);
    }

    /**
     * filter datastore based on search text*/
    filterItems(filterPhrase) {
        return this.items.filter(el => el.value.includes(filterPhrase));
    }
}