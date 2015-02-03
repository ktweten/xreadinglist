/**
 * Created by Kelly on 1/21/2015.
 */

angular.module('xReadingList').controller('DetailsController', ['$http', '$location', '$anchorScroll',
    function($http, $location, $anchorScroll) {
    var self = this;
    self.issue = {};
    self.showDetails = false;
    self.lastId = null;
    self.urls = [];
    self.coverRoot = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';
    self.extension = 'jpg';

    self.getDetails = function(issue, name) {

        if (issue._id !== self.lastId) {
            $location.hash(name + "-details");
            $anchorScroll();
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
