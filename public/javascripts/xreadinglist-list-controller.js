/**
 * Created by Kelly on 1/29/2015.
 */

angular.module('xReadingList').controller('ListController', ['infinite-scroll', function() {
    var self = this;
    self.list = [];
    self.limit = 100;
    self.selecting = false;

    self.setSelectionList = function(list) {
        if (self.list) {
            self.list = [];
            self.selecting = false;
        } else {
            self.list = list;
            self.selecting = true;
        }
    };

    self.increaseLimit = function() {
        self.limit += 100;
    };
}]);
