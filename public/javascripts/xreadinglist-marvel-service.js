/**
 * Created by Kelly on 1/27/2015.
 */

angular.module('xReadingList').service('MarvelService', ['$http', function($http) {
    var cache = {};

    function addCacheEntry(series, year, number) {
        cache[series + year + number] = {
            imageRoot: "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
            extension: "jpg",
            urls: [{type: "Plonk", url: "Over there"}, {type: "Donk", url: "Anywhere"}, {type: "Ook", url: "The Library"}],
            debug: "Added"
        }
    }

    function updateCacheEntry(series, year, number, imageRoot, extension, urls) {
        var key = series + year + number;

        cache[key].imageRoot = imageRoot;
        cache[key].extension = extension;
        cache[key].urls = urls;
        cache[key].debug = "Returned from Marvel";
    }

    function makeIssueCallback(s, y, n) {
        var series = s,
            year = y,
            number = n;

        return function(data, status, headers, config) {
            var imageRoot = "",
                extension = "",
                urls = [];

            if (data.data && data.data.results && data.data.results.length > 0)
            {
                urls = data.data.results[0].urls;
                imageRoot = data.data.results[0].thumbnail.path;
                extension = data.data.results[0].thumbnail.extension;
            }

            updateCacheEntry(series, year, number, imageRoot, extension, urls);
        };
    }

    function queryMarvelAPI(series, year, number) {
        var link = "http://gateway.marvel.com:80/v1/public/comics?title=";

        link = link.concat(series);
        link = link.concat('$startYear=' + year);
        link = link.concat('&issueNumber=' + number);
        link = link.concat('&hasDigitalIssue=true&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4');

        cache[series + year + number].debug = "Querying"
        $http.get(link)
        .success(makeIssueCallback(series, year, number))
        .error(function(data, status, headers, config) {
            cache[series + year + number].debug = "Error: " + data;
        });
    }

    function getInfo(series, year, number) {
        var key = series + year + number;

        if (!cache[key]) {
            addCacheEntry(series, year, number);
            queryMarvelAPI(series, year, number);
        }

        return cache[key];
    }


    return {
        getInfo: getInfo
    };
}]);