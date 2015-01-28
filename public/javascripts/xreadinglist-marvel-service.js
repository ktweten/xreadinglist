/**
 * Created by Kelly on 1/27/2015.
 */

angular.module('xReadingList').service('MarvelService', ['$http', function($http) {
     function makeIssueCallback(issue) {
        var foundIssue = issue;

        return function(data, status, headers, config) {
            if (data.data && data.data.results && data.data.results.length > 0) {
                foundIssue.coverRoot = data.data.results[0].thumbnail.path;
                foundIssue.extension = data.data.results[0].thumbnail.extension;
                foundIssue.urls = data.data.results[0].urls;
            }
        }
    }

    function getMarvelData(issue) {
        var link = "http://gateway.marvel.com:80/v1/public/comics?title=" + issue.series +
            "&startYear=" + issue.volume +
            "&issueNumber=" + issue.number +
            "&noVariants=true"+
            "&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4";

        $http.get(link, { cache: true }).success(makeIssueCallback(issue)).
        error(function(data, status, headers, config) {
            //?
        });
    }

    return {
        getMarvelData: getMarvelData
    }
}]);