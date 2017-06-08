/**
 * Created by simonvg on 2017-06-07.
 */
import {bindable, inject} from 'aurelia-framework';
import {TodoModel} from './../../lib/todo-model';

@inject(Element)
export class TodoViewAuerelia {
    element;
    @bindable items;

    constructor(element) {
        this.element = element;
        this.items = [];

        const model = new TodoModel("new object");
        model.isSelected = true;

        this.items.push(model);
    }

    attached() {

    }

    selectItem(item, event) {
        console.log(event.target);
    }
}