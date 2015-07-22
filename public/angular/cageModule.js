console.log('cageModule.js');
var app = angular.module('cageMatch', ['ui.router']);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
			.state('home', {
				url: "/",
				views: {
					"matchupView": { templateUrl: "angular/views/matchup.html" },
					"actorList": { templateUrl: "angular/views/actorList.html" },
					"rankingsView": { templateUrl: "angular/views/rankingsView.html" }
				}
			})
	});










