/**
 * Created by Kelly on 1/21/2015.
 */

angular.module('xReadingList').controller('DetailsController', ['$http', function($http) {
    var self = this;
    self.issue = {};
    self.showDetails = false;
    self.lastId = null;
    self.urls = [];

    self.getDetails = function(issue) {

        if (issue._id !== self.lastId) {
            self.showDetails = true;
            self.lastId = issue._id;
            self.coverRoot = issue.coverRoot;
            self.extension = issue.extension;
            self.urls = issue.urls;

            $http.post('/details', {
                id: issue._id
            }).success(function(data, status, headers, config) {
                if (data.length > 0){
                    self.issue = data[0];
                }
            });
        } else {
            self.showDetails = false;
            self.lastId = null;
        }
    };
}]);
