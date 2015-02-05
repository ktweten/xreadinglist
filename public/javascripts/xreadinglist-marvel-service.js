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

    function makeVolumeCallback(series, startYear, volume, offset) {
        var title = series,
            year = startYear,
            vol = volume,
            skip = offset + 100,
            map = {},
            index;

        for (index = 0; index < vol.length; index += 1) {
            map[ vol[index] ] = index;
        }

        return function(res, status, headers, config) {
            var i,
                j,
                issue,
                total,
                entry;

            if (res.data && res.data.results) {

                for (i = 0; i < res.data.results.length; i += 1) {
                    issue = res.data.results[i];
                    entry = map[issue.issueNumber.toString()];

                    if (entry) {
                        vol[entry].coverRoot = issue.thumbnail.path;
                        vol[entry].extension = issue.thumbnail.extension;
                        vol[entry].urls = mapUrls(issue.urls);
                    }

                    //for (j = 0; j < vol.length; j += 1) {
                    //    if (vol[j].number === issue.issueNumber.toString()) {
                    //        vol[j].coverRoot = issue.thumbnail.path;
                    //        vol[j].extension = issue.thumbnail.extension;
                    //        vol[j].urls = mapUrls(issue.urls);
                    //        break;
                    //    }
                    //}
                }
            }

            total = res.data.offset + res.data.count;
            if (total < res.data.total && res.data.limit === res.data.count && skip < 1000) {
                getMarvelVolumeData(title, year, skip, vol);
            }
        }
    }

    function getMarvelVolumeData(series, startYear, offset, volume) {
        var link = 'http://gateway.marvel.com:80/v1/public/comics?title=' + series +
            '&startYear=' + startYear +
            '&formatType=comic' +
            '&offset=' + offset +
            '&limit=' + 100 +
            '&noVariants=true' +
            '&apikey=2c7b5e832ec9ddc7c4dc4e432f24fbb4';

        $http.get(link, { cache: true }).success(makeVolumeCallback(series, startYear, volume, offset));
    }

    return {
        getMarvelData: getMarvelData,
        getMarvelVolumeData: getMarvelVolumeData
    }
}]);