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

        self.clear = function() {
            self.comics = [];
        };

        self.setCover = function(issueData) {
            var series = self.getSeries(issueData.title),
                issues = self.getIssues(series, issueData.volume),
                index;

            for (index = 0; index < issues.length; index += 1) {
                issues[index].thumbnail = "plarp";
                //if (issues[index].number === issueData.number) {
                //    issues[index].coverRoot = issueData.thumbnail.path;
                //    issues[index].extension = issueData.thumbnail.extension;
                //    issues[index].urls = issueData.urls;
                //}
            }
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

                issue.coverRoot = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
                issue.extension = "jpg";
                issue.urls = [{type: "Marvel.com", url: "http://www.marvel.com"}];

                if (issueIndex === issueList.length) {
                    issueList.push(issue);
                    issueList.sort(issueSort);
                }

                MarvelService.getMarvelData(issue, self);
            }
        }
    }

    return {
        CreateCollection: CreateCollection
    };
}]);