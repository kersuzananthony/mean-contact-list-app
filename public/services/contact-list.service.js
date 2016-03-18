'use strict';

(function() {

    myApp
        .factory('ContactList', [
            '$http',
            '$q',
            function($http, $q) {
                var getContactList = function() {
                    var defer = $q.defer();
                    $http.get('/contacts')
                        .success(function(contacts) {
                            console.log('success');
                            defer.resolve(contacts);
                        })
                        .catch(function(error) {
                            console.log('errror');
                            defer.reject(error);
                        });

                    return defer.promise;
                };

                var addContact = function(contact) {
                    var defer = $q.defer();

                    $http.post('/contacts', contact)
                        .success(function(newContact){
                            defer.resolve(newContact);
                        })
                        .catch(function(error) {
                            defer.reject(error);
                        });

                    return defer.promise;
                };

                var deleteContact = function(id) {
                    var defer = $q.defer();

                    $http.delete('/contacts/' + id)
                        .success(function() {
                            defer.resolve();
                        })
                        .catch(function(err) {
                            defer.reject(err);
                        });

                    return defer.promise;
                };

                var getContactById = function(id) {
                    var defer = $q.defer();

                    $http.get('/contacts/' + id)
                        .success(function(contact) {
                            defer.resolve(contact);
                        })
                        .catch(function(err) {
                            defer.reject(err);
                        });

                    return defer.promise;
                };

                var updateContact = function(contact) {
                    var defer = $q.defer();

                    if (!contact._id) {
                        defer.reject("Contact not valid");
                    } else {
                        $http.put('/contacts/' + contact._id, contact)
                            .success(function(updatedContact) {
                                defer.resolve(updatedContact);
                            })
                            .catch(function(err) {
                                defer.reject(err);
                            });
                    }

                    return defer.promise;
                };

                return {
                    getContactList: getContactList,
                    addContact: addContact,
                    deleteContact: deleteContact,
                    getContactById: getContactById,
                    updateContact: updateContact
                }
            }
        ]);

})();