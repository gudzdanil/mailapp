angular
    .module('inbox.interface')
    .config(routing);

function routing($routeProvider) {
    $routeProvider
        .otherwise({redirectTo: '/login'})
        .when('/login', {
            template: '<login-page></login-page>'
        })
        .when('/home', {
            template: '<email-page></email-page>'
        });
}
routing.$inject = ['$routeProvider'];