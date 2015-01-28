/**
 * Created by Kelly on 1/27/2015.
 */

angular.module('xReadingList').service('MarvelService', ['$http', function($http) {
     function makeIssueCallback(issue, col) {
        var foundIssue = issue;

        return function(res, status, headers, config) {
            if (res.data && res.data.results && res.data.results.length > 0) {
                foundIssue.coverRoot = res.data.results[0].thumbnail.path;
                foundIssue.extension = res.data.results[0].thumbnail.extension;
                foundIssue.urls = res.data.results[0].urls;
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