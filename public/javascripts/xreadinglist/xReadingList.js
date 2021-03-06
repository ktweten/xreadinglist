/**
 * Created by Kelly on 1/2/2015.
 */
var xReadingListApp = angular.module('xReadingList', ['infinite-scroll']);

xReadingListApp.controller('QueryController', ['$http', '$location', '$anchorScroll', 'NameList', 'Collection',
    function($http, $location, $anchorScroll, NameList, Collection) {
        'use strict';

        var self = this;
        self.issues = 0;
        self.startYear = 1963;
        self.endYear = 2015;

        self.titles = new NameList.CreateList('Titles', false);
        self.characters = new NameList.CreateList('Characters', true);
        self.writers = new NameList.CreateList('Writers', false);
        self.pencillers = new NameList.CreateList('Pencillers', false);
        self.inkers = new NameList.CreateList('Inkers', false);
        self.collection = new Collection.CreateCollection();
        self.showQuery = true;

        self.lists = [self.titles, self.characters, self.writers, self.pencillers, self.inkers];

        self.hideResults = function() {
            self.showQuery = true;
            $location.hash("query");
            $anchorScroll();
        };

        // Query for all issues matching a (potentially very complicated) set of requirements.
        self.query = function() {
            $http.post('/issues', {
                requiredCharacters: self.characters.allOf,
                optionalCharacters: self.characters.anyOf,
                excludedCharacters: self.characters.excluded,

                optionalTitles: self.titles.anyOf,
                excludedTitles: self.titles.excluded,

                optionalWriters: self.writers.anyOf,
                excludedWriters: self.writers.excluded,

                optionalPencillers: self.pencillers.anyOf,
                excludedPencillers: self.pencillers.excluded,

                optionalInkers: self.inkers.anyOf,
                excludedInkers: self.inkers.excluded,

                startYear: Math.min(self.startYear),
                endYear: Math.max(self.endYear)

            }).success(function(data, status, headers, config) {
                self.issues = data.length;
                self.showQuery = false;
                self.collection.clear();
                self.collection.addIssues(data);
                $location.hash("results-list");
                $anchorScroll();
            });
        };
    }]);

// When selecting from one of the categories, have the selection button float at the top of the screen
// if you scroll past to make it easier to close when scrolling through a long list.
$(function () {
    $(window).scroll(function () {
        var windowTop = $(window).scrollTop();

        $('.fixed-title').each(function() {
            if (windowTop > $(this).parent().offset().top) {
                $('.fixed-title').removeClass('fixed');
                $(this).addClass('fixed');
            } else {
                $(this).removeClass('fixed');
            }
        });
    });

    $(".selecting").click( function() {
        $(this).toggleClass('fixed-title');
        $(this).removeClass('fixed');
    });
});