angular
    .module('inbox.interface')
    .service('GoogleService', GoogleService);

function GoogleService($q, $cookies, $location) {
    this._$q = $q;
    this._cookies = $cookies;
    this._location = $location;
    window.loginCallBack = angular.bind(this, this.loginCallback);
}

GoogleService.prototype.loadGmailApi = function () {
    var defer = this._$q.defer();

    var token = gapi.auth.getToken();
    if (!token) {
        this._location.path("/login");
        defer.reject();
    }
    gapi.client.load('gmail', 'v1', angular.bind(this, function () {
        defer.resolve();
    }));
    return defer.promise;
};

GoogleService.prototype.loginCallback = function (result) {
    console.log(this, result);
    if (result.status.signed_in) {
        if (this.loginCallback) {
            this.loginCallback();
            delete this.loginCallback;
        }
    }
    this._cookies.put('google_auth_token', angular.toJson(result));
};
GoogleService.prototype.login = function (callback) {
    var myParams = {
        'clientid': '107302446657-sv8l6timms2lrr1nfvs6gvfkjt32fmjp.apps.googleusercontent.com',
        'cookiepolicy': 'single_host_origin',
        'callback': 'loginCallBack',
        'approvalprompt': 'force',
        'scope': 'https://www.googleapis.com/auth/gmail.readonly'
    };
    gapi.auth.signIn(myParams);
    this.loginCallback = callback;
};
GoogleService.prototype.getMessages = function (nextPage) {
    var defer = this._$q.defer();
    var userId = "me";
    gapi.client.gmail.users.messages.list({
        'userId': userId,
        'maxResults': 20,
        pageToken: nextPage
    }).execute(function (resp) {
        var messages = resp.messages;
        var messagesArr = [];
        for (var i = 0; i < messages.length; i++) {
            gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': messages[i].id
            }).execute(onMessageReceived);
        }
        function onMessageReceived(resp2) {
            messagesArr.push(resp2);
            if (messagesArr.length === messages.length) {
                defer.resolve( {messages: messagesArr, next_page: resp.nextPageToken});
            }
        }
    });
    return defer.promise;
};

GoogleService.$inject = ['$q', '$cookies', '$location'];