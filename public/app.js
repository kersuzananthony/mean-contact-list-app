'use strict';

var myApp = angular.module('contactApp', ['ui.router', 'ngMessages']);

myApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/contacts");
        //
        // Now set up the states
        $stateProvider
            .state('Contacts', {
                url: "/contacts",
                templateUrl: "views/contact-list.html",
                controller: 'ContactListController'
            });
    }]);