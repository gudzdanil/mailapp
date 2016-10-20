angular
    .module('inbox.interface')
    .component('email', {
        templateUrl: '/templates/email.html',
        controller: EmailController,
        controllerAs: 'vmEmail',
        bindings: {
            message: '<'
        }
    });
function EmailController(){
    this.expanded = false;

    for(var i = 0; i<this.message.payload.headers.length; i++){
        if(this.message.payload.headers[i].name === 'Subject'){
            this.message.title = this.message.payload.headers[i].value;
        }
    }
}
EmailController.prototype.toggle = function() {
    this.expanded = !this.expanded;
};