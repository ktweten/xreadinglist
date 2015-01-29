/**
 * Created by Kelly on 1/15/2015.
 */

function addNameToList(name, list) {
    list.push(name);
    list.sort();
}

function removeNameFromList(name, list) {
    var nameIndex = list.indexOf(name);
    if (nameIndex >= 0) {
        list.splice(nameIndex, 1);
    }
}

angular.module('xReadingList').factory('NameList', ['$http', '$filter', function($http, $filter) {
    function CreateList(name, allColumn) {
        var self = this;

        self.title = name;
        self.names = [];
        self.allOf = [];
        self.anyOf = [];
        self.excluded = [];
        self.selecting = false;
        self.hasAllColumn = allColumn;
        self.limit = 50;
        self.displayList = [];

        $http.post('/list', { listName: name }).success(function (doc) {
            if (doc && doc.length > 0) {
                self.names = doc[0].names;
                self.names.sort();
            }
        });

        this.setSelecting = function() {
            self.selecting = !self.selecting;
            self.limit = 50;
            self.displayList = $filter('limitTo')(self.names, self.limit);
        };

        this.increaseLimit = function() {
            self.limit += 50;
            self.displayList = $filter('limitTo')(self.names, self.limit);
        };

        this.clearSelections = function() {
            self.allOf = [];
            self.anyOf = [];
            self.excluded = [];
        };

        this.getDescription = function() {
            var strings = [];

            if (self.allOf.length > 0) {
                strings.push('All of: ' + self.allOf.join(', '));
            }

            if (self.anyOf.length > 0) {
                strings.push('Any of: ' + self.anyOf.join(', '));
            }

            if (self.excluded.length > 0) {
                strings.push('Excluding: ' + self.excluded.join(', '));
            }

            return strings;
        };

        this.toggleList = function(list, name) {
            var i,
                addTo,
                removeFrom;

            if (list === 'All') {
                addTo = self.allOf;
                removeFrom = [self.anyOf, self.excluded];
            } else if (list === 'Any') {
                addTo = self.anyOf;
                removeFrom = [self.allOf, self.excluded];
            } else if (list === 'Exclude') {
                addTo = self.excluded;
                removeFrom = [self.allOf, self.anyOf];
            }

            if (addTo.indexOf(name) >= 0) {
                removeNameFromList(name, addTo);
            } else {
                addNameToList(name, addTo);
                for (i = 0; i < removeFrom.length; i += 1) {
                    removeNameFromList(name, removeFrom[i]);
                }
            }
        };
    }

    return {
        CreateList: CreateList
    }
}]);
