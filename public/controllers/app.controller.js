'use strict';

(function() {

    myApp
        .controller('ContactListController', [
            '$scope',
            'ContactList',
            function($scope, ContactList) {
                $scope.newContact = {};
                $scope.contacts = [];
                $scope.errors = {};

                var init = function() {
                    ContactList.getContactList()
                        .then(function(contacts) {
                            $scope.contacts = contacts;
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                };

                $scope.addContact = function() {
                   if ($scope.newContact._id) {
                       alert("Contact already exists, you can only update it");
                   } else {
                       if ($scope.newContact.name != "" && $scope.newContact.number != "" && $scope.newContact.email != "") {
                           ContactList.addContact($scope.newContact)
                               .then(function() {
                                   init();
                                   $scope.newContact = {};
                                   $scope.errors = {};
                               })
                               .catch(function(error) {
                                   $scope.errors = error.data.errors;
                               });
                       } else {
                           alert("Missing info");
                       }
                   }
                };

                $scope.removeContact = function(id) {
                    if (id) {
                        ContactList.deleteContact(id)
                            .then(function(newContact) {
                                init();
                            })
                            .catch(function(err) {
                                alert("Cannot delete contact");
                                console.error('error when deleting', err);
                            })
                    } else {
                        alert('No contact selected');
                    }
                };

                $scope.editContact = function(id) {
                    if (id) {
                        ContactList.getContactById(id)
                            .then(function(contact){
                                $scope.newContact = contact;
                            })
                            .catch(function(err){
                                alert("Cannot find data");
                                console.error('error while getting data', err);
                            })
                    } else {
                        alert('No contact selected');
                    }
                };

                $scope.updateContact = function() {
                    if (!$scope.newContact._id) {
                        alert("This is a new contact, you need to add it first before updating!");
                    } else {
                        if ($scope.newContact.name != "" && $scope.newContact.number != "" && $scope.newContact.email != "") {
                            ContactList.updateContact($scope.newContact)
                                .then(function() {
                                    init();
                                    $scope.newContact = {};
                                    $scope.errors = {};
                                })
                                .catch(function(error) {
                                    $scope.errors = error.data.errors;
                                });
                        } else {
                            alert("Missing info");
                        }
                    }
                };

                init();
            }
        ]);

})();