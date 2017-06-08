export class App {
    router = null;

    configureRouter(config, router) {
        config.title = 'Pragma Products';
        config.map([
            {route: ['', 'todo-view-auerelia'], name: 'todo-view-auerelia',      moduleId: 'views/todo-view/todo-view-auerelia',      nav: true, title: 'Todo View'},
        ]);

        this.router = router;
    }
}