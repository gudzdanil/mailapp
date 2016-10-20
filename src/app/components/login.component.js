angular
    .module('inbox.interface')
    .component('loginPage', {
        templateUrl: '/templates/login-page.html',
        controller: LoginController,
        controllerAs: 'vmLogin'
    });
function LoginController(GoogleService, $location, $scope) {
    this._googleService = GoogleService;
    this._location = $location;
    this._scope = $scope;

}
LoginController.$inject = ['GoogleService', '$location', '$scope'];

LoginController.prototype.login = function () {
    this._googleService.login(angular.bind(this, this.onLoggedIn));
};
LoginController.prototype.onLoggedIn = function () {
    this._scope.$apply(angular.bind(this, function() {this._location.path("/home");}));
};