/**
 * Created by Kelly on 1/21/2015.
 */

angular.module('xReadingList').controller('DetailsController', ['$http', function($http) {
    var self = this;
    self.issue = null;
    self.showDetails = false;
    self.lastId = null;
    self.data = [];
    self.urls = [];

    self.getDetails = function(issueId) {

        if (issueId !== self.lastId) {
            self.showDetails = true;
            self.lastId = issueId;

            $http.post('/details', {
                id: issueId
            }).success(function(data, status, headers, config) {
                var link = "http://gateway.marvel.com:80/v1/public/comics?title=",
                    index;

                if (data.length > 0){
                    self.issue = data[0];

                    link = link.concat(self.issue.series);
                    link = link.concat('&issueNumber=');
                    link = link.concat(self.issue.number);
                    link = link.concat('&hasDigitalIssue=true&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4');

                    self.link = "";
                    $http.get(link).success(function(data, status, headers, config) {
                        var urls = data.data.results[0].urls;
                        self.rawData = data.data;
                        self.results = data.data.results;
                        self.result = self.results[0];
//                        self.urls = data.data.results[0].urls;
                        for (index = 0; index < urls.length; index += 1) {
                            if (urls[index].type === "reader") {
                                self.url = urls[index];
                                break;
                            }
                        }
                        //self.img = data.data.results[0].thumbnail;
                    }).
                        error(function(data, status, headers, config) {
                            self.link = data;
                    });
                }
            });
        } else {
            self.showDetails = false;
            self.lastId = null;
        }
    };
}]);
