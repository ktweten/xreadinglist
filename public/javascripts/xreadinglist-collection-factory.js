/**
 * Created by Kelly on 1/21/2015.
 */

function issueSort(a, b) {
    if (isNaN(a.number)) {
        return 1;
    } else if (isNaN(b.number)) {
        return -1;
    } else {
        return Number(a.number) - Number(b.number);
    }
}

angular.module('xReadingList').factory('Collection', [ 'MarvelService', function(MarvelService) {
    function CreateCollection() {
        var self = this;

        self.comics = [];

        self.debug = "?";

        self.clear = function() {
            self.comics = [];
        };

        self.getSeries = function(title) {
            var series = null,
                index;

            for (index = 0; index < self.comics.length; index += 1) {
                if (self.comics[index].name === title) {
                    series = self.comics[index];
                    break;
                }
            }

            if (!series) {
                series = { name: title, volumes: [], issues: [] };
                self.comics.push(series);
            }

            return series;
        };

        self.getIssues = function(series, volumeName) {
            var issues = null,
                index,
                volume;

            for (index = 0; index < series.volumes.length; index += 1) {
                if (series.volumes[index].name === volumeName) {
                    issues = series.volumes[index].issues;
                    break;
                }
            }

            if (!issues) {
                volume = { name: volumeName, issues: [], selectedIssue: false, expand: false };
                series.volumes.push(volume);
                issues = volume.issues;
            }

            return issues;
        };

        self.addIssues = function(data) {
            var issueIndex,
                dataIndex,
                issueList,
                series,
                issue;

            self.debug = "";

            for (dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
                issue = data[dataIndex];
                series = self.getSeries(issue.series, self.comics);
                issueList = self.getIssues(series, issue.volume);

                if (!issue.number) {
                    issue.number = 'Oneshot';
                }
                for (issueIndex = 0; issueIndex < issueList.length; issueIndex += 1) {
                    if (issueList[issueIndex].number === issue.number) {
                        break;
                    }
                }

                if (issueIndex === issueList.length) {
                    issue.coverRoot = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';
                    issue.extension = 'jpg';
                    issue.urls = [{type: 'Marvel.com', url: 'http://www.marvel.com'}];

                    MarvelService.getMarvelVolumeData(issue.series, issue.volume, 0, issueList);

                    issueList.push(issue);
                    issueList.sort(issueSort);
                } else {
                    issue.coverRoot = issueList[issueIndex].coverRoot;
                    issue.extension = issueList[issueIndex].extension;
                    issue.urls = issueList[issueIndex].urls;

                    issueList[issueIndex] = issue;
                }
            }
        }
    }

    return {
        CreateCollection: CreateCollection
    };
}]);