/**
 * Class responsible for to do object properties and methods related to model
 */
import {bindable} from "aurelia-framework";

export class TodoModel {
    id;
    @bindable value;
    @bindable isComplete;
    @bindable isSelected;

    constructor(value) {
        this.id = 0;
        this.value = value;
        this.isComplete = false;
        this.isSelected = false;
    }

    isSelectedChanged(){
        console.log(this.isSelected);
    }
}
