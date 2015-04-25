console.log('cageModule.js')
var app = angular.module('cageMatch', ['ui.router'])
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true);
	$stateProvider
		.state('home', {
		  url: "/",
		  views: {
		    "matchupView": { templateUrl: "angular/views/matchup.html" },
		    "actorList": { templateUrl: "angular/views/actorList.html" }
		  }
		})
})


app.controller('MatchupController', function($scope, $window, matchup){
	console.log('matchup controller');
	if(!$window.actorId){
		$window.actorId = "nm0000115";
	}
	$scope.newId = "";

	// matchup.set().then(function(resp){
	// 	if(!$scope.movieA || $scope.movieA === ""){
	// 		$scope.movieA = resp.data.movieA;
	// 		$scope.movieB = resp.data.movieB;
	// 	}
	// })
	$scope.newmatchup = function(clicked){
		if(clicked.title === $scope.movieA.title){
			var winner = $scope.movieA;
			var loser = $scope.movieB;
		} else {
			var winner = $scope.movieB;
			var loser = $scope.movieA;
		}
		matchup.score(winner, loser, $window.actorId).then(function(a,b){
			matchup.set().then(function(resp){
				$scope.movieA = resp.data.movieA;
				$scope.movieB = resp.data.movieB;
			})
		})
	}
	$scope.queryActor = function(){
		// set windowActorId
		var id = $scope.newId

		$.get('/getCollection?id='+id, function(actorId){
			$window.actorId = actorId;
			$.get('/photos?id='+actorId)
			matchup.set().then(function(resp){
				$scope.movieA = resp.data.movieA;
				$scope.movieB = resp.data.movieB;
			})

		})
	}
})

app.controller("ActorController", function($scope, $http){
	console.log('actor controller');

	$http({
		method: 'GET',
		url: 'actorList'
	}).then(function(resp){
		$scope.actors = resp.data
	})
})

app.factory('matchup', ['$http', '$window', function($http, $window){
	function setMatchup(){
		return $http({
			method: 'GET',
			url: '/setMatchup?id='+$window.actorId
		})
	};
	function scoreMatchup(winner, loser, actorId){
		return $http({
			method : "POST",
			url : "/scoreMatchup",
			data : {
				actorId : actorId,
				winner : winner.title,
				loser : loser.title
			}
		})
	}
	return {
		set : setMatchup,
		score : scoreMatchup
	}
}]);
