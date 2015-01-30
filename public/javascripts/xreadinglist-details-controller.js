/**
 * Created by Kelly on 1/21/2015.
 */

angular.module('xReadingList').controller('DetailsController', ['$http', function($http) {
    var self = this;
    self.issue = {};
    self.showDetails = false;
    self.lastId = null;
    self.urls = [];
    self.coverRoot = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';
    self.extension = 'jpg';

    self.setUrls = function(urls) {
        var labelMap = {
                reader: 'Read on Marvel Unlimited',
                purchase: 'Buy Digital Copy ',
                details: 'Details on Marvel'
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

        self.urls = mappedUrls.length > 0 ? mappedUrls : [{type: 'Marvel.com', url: 'http://www.marvel.com'}];
    };

    self.getDetails = function(issue) {

        if (issue._id !== self.lastId) {
            self.showDetails = true;
            self.lastId = issue._id;
            self.coverRoot = issue.coverRoot;
            self.extension = issue.extension;
            self.urls = issue.urls;

            $http.post('/details', {
                id: issue._id
            }).success(function(data, status, headers, config) {
                if (data.length > 0){
                    self.issue = data[0];
                }
            });
        } else {
            self.showDetails = false;
            self.lastId = null;
        }
    };
}]);
