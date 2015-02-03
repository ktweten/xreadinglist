/**
 * Created by Kelly on 1/27/2015.
 */
function mapUrls(urls) {
    var labelMap = {
            reader: 'Read on Marvel Unlimited',
            purchase: 'Buy Digital Copy ',
            detail: 'Details on Marvel'
        },
        mappedUrls = [],
        mappedLabel,
        index;

    for (index = 0; index < urls.length; index += 1) {
        mappedLabel = labelMap[urls[index].type] || "";
        if (mappedLabel) {
            mappedUrls.push({ type: mappedLabel, url: urls[index].url });
        }
    }

    return mappedUrls.length > 0 ? mappedUrls : [{type: 'Marvel.com', url: 'http://www.marvel.com'}];
}

angular.module('xReadingList').service('MarvelService', ['$http', function($http) {
    var data = {};

    //    found = "";
    //
    //function getVolumeData(series, startYear) {
    //    var seriesEntry;
    //
    //    if (!data[series]) {
    //        data[series] = {};
    //    }
    //    seriesEntry = data[series];
    //
    //    if (!seriesEntry[startYear]) {
    //        seriesEntry[startYear] = {}
    //    }
    //    return seriesEntry[startYear];
    //}

    function makeSetDataCallback(issue, debug) {
        var origIssue = issue;

        return function(res, status, headers, config) {
            var i,
                offset = 0,
                foundIssue,
                issueNumber;

            if (res.data && res.data.results) {
                debug.stringVersion = "#Results: " + res.data.results.length;
                //for (i = 0; i < res.data.results.length; i += 1) {
                //    issueNumber = "" + res.data.results[i].issueNumber;
                //
                //    if (!foundVolume[issueNumber]) {
                //        foundVolume[issueNumber] = {};
                //        foundIssue = foundVolume[issueNumber];
                //
                //        foundIssue.coverRoot = res.data.results[i].thumbnail.path;
                //        foundIssue.extension = res.data.results[i].thumbnail.extension;
                //        foundIssue.urls = mapUrls(res.data.results[i].urls);
                //
                //        if (issue.number === issueNumber) {
                //            origIssue.coverRoot = res.data.results[i].thumbnail.path;
                //            origIssue.extension = res.data.results[i].thumbnail.extension;
                //            origIssue.urls = mapUrls(res.data.results[i].urls);
                //        }
                //    }
                //}

                offset = res.data.offset + res.data.count;
                if (res.data.total > offset) {

                }
            }
        }
    }

    function makeIssueCallback(issue) {
        var foundIssue = issue;

        return function(res, status, headers, config) {
            if (res.data && res.data.results && res.data.results.length > 0) {
                foundIssue.coverRoot = res.data.results[0].thumbnail.path;
                foundIssue.extension = res.data.results[0].thumbnail.extension;
                foundIssue.urls = mapUrls(res.data.results[0].urls);
            }
        }
    }

    function getMarvelData(issue, debug) {
        var link = 'http://gateway.marvel.com:80/v1/public/comics?title=' + issue.series +
            '&startYear=' + issue.volume +
            //'&issueNumber=' + issue.number +
            '&noVariants=true' +
            '&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4';

        //    volumeData = getVolumeData(issue.series, issue.volume);
        //
        //if (!volumeData[issue.number]) {
        //    volumeData[issue.number] = {
        //        coverRoot: "",
        //        extension: "",
        //        urls: []
        //    };
        //}
        //
        //issue.coverRoot = volumeData[issue.number].coverRoot;
        //issue.extension = volumeData[issue.number].extension;
        //issue.urls = volumeData[issue.number].urls;

        if (!volumeData[issue.number]) {
             $http.get(link, { cache: true }).success(makeSetDataCallback(issue, debug));
        }
        //$http.get(link, { cache: true }).success(makeIssueCallback(issue));
    }

    function getSummary() {
        return found;
    }

    return {
        getMarvelData: getMarvelData,
        getSummary: getSummary
    }
}]);