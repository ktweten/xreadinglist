/**
 * Created by Kelly on 1/21/2015.
 */

angular.module('xReadingList').controller('DetailsController', ['$http', function($http) {
    var self = this;
    self.issue = null;
    self.showDetails = false;
    self.lastId = null;

    self.getDetails = function(issueId) {
        self.showDetails = issueId !== self.lastId;
        self.lastId = issueId;

        $http.post('/details', {
             id: issueId
        }).success(function(data, status, headers, config) {
            var link = "http://gateway.marvel.com:80/v1/public/comics?title=";

            if (data.length > 0){
                self.issue = data[0];

                link = link.concat(self.issue.series);
                link = link.concat('&issueNumber=');
                link = link.concat(self.issue.number);
                link = link.concat('&hasDigitalIssue=true&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4');

                self.link = "Get";
                $http.get(link).success(function(data, status, headers, config) {
                    self.link = "Success";
                }).
                error(function(data, status, headers, config) {
                    alert("ERROR " + data.toString());
                        self.link = data;
                });
            }
        });

    };
}]);
