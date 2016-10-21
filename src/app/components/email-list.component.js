angular
    .module('inbox.interface')
    .component('emailList', {
        templateUrl: '/templates/email-list.html',
        controller: EmailListController,
        controllerAs: 'vmEmailList'
    });
function EmailListController(GoogleService) {
    this.loading = false;
    this.groups = [];
    this.groupsMap = {};
    this.nextPage = null;
    this._GoogleService = GoogleService;
    this.groupsSeparator = {};
    document.addEventListener("scroll", angular.bind(this, function (event) {
        this.loadNewMessages();
    }));
    this.groupsSeparator.Today = (function () {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return {min: +today, max: Number.POSITIVE_INFINITY};
    }).call(this);
    this.groupsSeparator.Yesterday = (function () {
        var now = new Date();
        var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        return {min: +yesterday, max: +this.groupsSeparator.Today.min};
    }).call(this);
    this.groupsSeparator["This week"] = (function () {
        var now = new Date();
        var week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return {min: +week, max: +this.groupsSeparator.Yesterday.min};
    }).call(this);
    this.groupsSeparator.Old = (function () {
        return {min: 0, max: +this.groupsSeparator["This week"].min};
    }).call(this);
    this.loadMessages();
}


EmailListController.prototype.loadMessages = function () {
    if (this.loading) {
        return;
    }
    this.loading = true;
    this._GoogleService.loadGmailApi()
        .then(angular.bind(this, function () {
            return this._GoogleService.getMessages.apply(this._GoogleService, this.nextPage ? [this.nextPage] : []);
        })).then(angular.bind(this, function (resp) {
        this.nextPage = resp.next_page;
        var i;
        var messages = resp.messages;

        var group = {};
        for (i = 0; i < messages.length; i++) {
            var groupName = this.getGroupName(messages[i].internalDate, this.groupsSeparator);
            this.groupsMap[groupName] = this.groupsMap[groupName] || [];
            this.groupsMap[groupName].push(messages[i]);
        }

        for (i in this.groupsMap) {
            if(!this.groups.filter(checkGroupTitle(i)).length) {
                this.groups.push({
                    title: i,
                    messages: this.groupsMap[i]
                });
            }
        }
        this.loading = false;
        console.log(this.groupsMap);
    }));

    function checkGroupTitle(title) {
        return function(gr) {
            return gr.title === title;
        };
    }
};

EmailListController.prototype.getGroupName = function (date, separators) {
    var separator;
    for (var i in separators) {
        separator = separators[i];
        if (date >= separator.min && date <= separator.max) {
            return i;
        }
    }
};

EmailListController.prototype.loadNewMessages = function () {
    var lastDiv = document.querySelector("#scroll-content");
    var lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
    var pageOffset = window.pageYOffset + window.innerHeight;

    if (pageOffset > lastDivOffset - 20) {
        this.loadMessages();
    }
};
EmailListController.$inject = ['GoogleService'];