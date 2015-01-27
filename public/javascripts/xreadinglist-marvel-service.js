/**
 * Created by Kelly on 1/27/2015.
 */

angular.module('xReadingList').service('MarvelService', ['$http', function($http) {
    //var self = this;
    //
    //self.cache = {};
    //self.status = "Idle";
    //self.cache = {};
    //
    //function addCacheEntry(series, year, number) {
    //    self.cache[series + year + number] = {
    //        imageRoot: "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
    //        extension: "jpg",
    //        urls: [{type: "Plonk", url: "Over there"}, {type: "Donk", url: "Anywhere"}, {type: "Ook", url: "The Library"}],
    //        debug: "Added"
    //    }
    //}
    //
    //function updateCacheEntry(series, year, number, imageRoot, extension, urls) {
    //    var key = series + year + number;
    //
    //    self.cache[key].imageRoot = imageRoot;
    //    self.cache[key].extension = extension;
    //    self.cache[key].urls = urls;
    //    self.cache[key].debug = "Returned from Marvel";
    //}
    //
    //function makeIssueCallback(s, y, n) {
    //    var series = s,
    //        year = y,
    //        number = n;
    //
    //    return function(data, status, headers, config) {
    //        var imageRoot = "",
    //            extension = "",
    //            urls = [];
    //
    //        if (data.data && data.data.results && data.data.results.length > 0)
    //        {
    //            urls = data.data.results[0].urls;
    //            imageRoot = data.data.results[0].thumbnail.path;
    //            extension = data.data.results[0].thumbnail.extension;
    //            self.status = "Returned data";
    //        } else {
    //            self.status = "Returned no data";
    //        }
    //
    //        updateCacheEntry(series, year, number, imageRoot, extension, urls);
    //    };
    //}
    //
    //function queryMarvelAPI(series, year, number) {
    //    var link = "http://gateway.marvel.com:80/v1/public/comics?title=";
    //
    //    link = link.concat(series);
    //    link = link.concat('$startYear=' + year);
    //    link = link.concat('&issueNumber=' + number);
    //    link = link.concat('&hasDigitalIssue=true&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4');
    //
    //    self.cache[series + year + number].debug = "Querying";
    //    self.status = "Sending";
    //    $http.get(link)
    //    .success(makeIssueCallback(series, year, number))
    //    .error(function(data, status, headers, config) {
    //        self.cache[series + year + number].debug = "Error: " + data;
    //        self.status = "Error: " + data;
    //    });
    //}
    //
    //function getInfo(series, year, number) {
    //    var key = series + year + number;
    //
    //    if (!self.cache[key]) {
    //        addCacheEntry(series, year, number);
    //        queryMarvelAPI(series, year, number);
    //    }
    //
    //    return self.cache[key];
    //}
    //return {
    //    cache: self.cache
    //};

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