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

    function getMarvelData(issue) {
        var link = 'http://gateway.marvel.com:80/v1/public/comics?title=' + issue.series +
            '&startYear=' + issue.volume +
            '&issueNumber=' + issue.number +
            '&noVariants=true' +
            '&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4';

        $http.get(link, { cache: true }).success(makeIssueCallback(issue));
    }

    function makeVolumeCallback(volume) {
        var foundVolume = volume;

        return function(res, status, headers, config) {
            var i,
                j,
                issue,
                number,
                found = false;

            for (j = 0; j < foundVolume.length; j += 1) {
                foundVolume[j].coverRoot = "";
                if (res.data) {
                    foundVolume[j].coverRoot = "res.data";
                }
                if (res.data && res.data.results) {
                    foundVolume[j].coverRoot = "res.data && res.data.results " + res.data.results.length;
                }
            }

            if (res.data && res.data.results) {

                for (i = 0; i < res.data.results; i += 1) {
                    issue = res.data.results[i];
                    found = false;

                    for (j = 0; j < foundVolume.length; j += 1) {
                        if (Number(foundVolume[j].number) === issue.issueNumber) {
                            found = true;
                            foundVolume[j].coverRoot = issue.thumbnail.path;
                            foundVolume[j].extension = issue.thumbnail.extension;
                            foundVolume[j].urls = mapUrls(issue.urls);
                            break;
                        }
                    }
                }
            }
        }
    }

    function makeErrorCallback(volume) {
        var issues = volume;

        return function (res, status, headers, config) {
            for (var j = 0; j < issues.length; j += 1) {
                issues[j].coverRoot = "";
            }
        };
    }

    function getMarvelVolumeData(series, startYear, volume) {
        var link = 'http://gateway.marvel.com:80/v1/public/comics?title=' + series +
            '&startYear=' + startYear +
            '&noVariants=true' +
            '&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4';

        $http.get(link, { cache: true }).success(makeVolumeCallback(volume))
            .error(makeErrorCallback(volume));
    }

    return {
        getMarvelData: getMarvelData,
        getMarvelVolumeData: getMarvelVolumeData
    }
}]);