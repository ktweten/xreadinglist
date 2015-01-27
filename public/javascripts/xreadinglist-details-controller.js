/**
 * Created by Kelly on 1/21/2015.
 */

angular.module('xReadingList').controller('DetailsController', ['$http', 'MarvelService', function($http, MarvelService) {
    var self = this;
    self.issue = {};
    self.showDetails = false;
    self.lastId = null;
    self.data = [];
    self.urls = [];
    self.marvelService = MarvelService;

    self.getCoverPath = function() {
        var coverPath = "";

        if (self.issue.coverRoot) {
            coverPath = self.issue.coverRoot + "/portrait_uncanny."  + self.issue.extension;
        }

        return coverPath;
    };

    self.getDetails = function(issueId) {

        if (issueId !== self.lastId) {
            self.showDetails = true;
            self.lastId = issueId;

            $http.post('/details', {
                id: issueId
            }).success(function(data, status, headers, config) {
                var link;

                if (data.length > 0){
                    self.issue = data[0];

                    link = "http://gateway.marvel.com:80/v1/public/comics?title=" + self.issue.series +
                    "&startYear=" + self.issue.volume +
                    "&issueNumber=" + self.issue.number +
                    "&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4";

                    $http.get(link, { cache: true }).success(function(data, status, headers, config) {
                        if (data.data && data.data.results && data.data.results.length > 0) {
                            self.issue.coverRoot = data.data.results[0].thumbnail.path;
                            self.issue.extension = data.data.results[0].thumbnail.extension;
                            self.issue.urls = data.data.results[0].urls;
                        }
                    }).
                    error(function(data, status, headers, config) {
                        //?
                    });
                }
            });
        } else {
            self.showDetails = false;
            self.lastId = null;
        }
    };
}]);
