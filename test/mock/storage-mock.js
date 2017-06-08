class LocalStorage {
    constructor(){
        this.items = new Map();
    }

    setItem(key, value){
        this.items.set(key, value);
    }

    getItem(key){
        if(this.items.has(key)){
            return this.items.get(key);
        }

        return null;
    }

    clear(){
        this.items.clear();
    }
}

global.localStorage = new LocalStorage();