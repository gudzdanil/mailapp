angular
    .module('inbox.interface')
    .component('emailGroupList', {
        templateUrl: '/templates/email-group-list.html',
        controller: EmailGroupListController,
        controllerAs: 'vmEmailGroupList',
        bindings: {
            group: '<'
        }
    });
function EmailGroupListController() {
}

