angular
    .module('inbox.interface')
    .component('emailList', {
        templateUrl: '/templates/email-list.html',
        controller: EmailListController,
        controllerAs: 'vmEmailList'
    });
function EmailListController(GoogleService) {
    var groupsSeparator = {};
    groupsSeparator.Today = (function() {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return {min: +today, max: Number.POSITIVE_INFINITY};
    })();
    groupsSeparator.Yesterday = (function() {
        var now = new Date();
        var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
        return {min: +yesterday, max: +groupsSeparator.Today.min};
    })();
    groupsSeparator["This week"] = (function() {
        var now = new Date();
        var week = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
        return {min: +week, max: +groupsSeparator.Yesterday.min};
    })();
    groupsSeparator.Old = (function() {
        return {min: 0, max: +groupsSeparator["This week"].min};
    })();


    GoogleService.loadGmailApi()
        .then(function () {
            return GoogleService.getMessages();
        }).then(angular.bind(this, function (resp) {
            var i;
            this.messages = resp;
            this.groups = [];
            var groups = {};

            var group = {};
            for (i = 0; i < this.messages.length; i++) {
                var groupName = this.getGroupName(this.messages[i].internalDate, groupsSeparator);
                groups[groupName] = groups[groupName] || [];
                groups[groupName].push(this.messages[i]);
            }

            for(i in groups) {
                this.groups.push({
                    title: i,
                    messages: groups[i]
                });
            }

            console.log(this.groups);
        }));
}
EmailListController.prototype.getGroupName = function(date, separators) {
    var separator;
    for(var i in separators) {
        separator = separators[i];
        if(date >= separator.min && date <= separator.max) {
            return i;
        }
    }
};
EmailListController.$inject = ['GoogleService'];