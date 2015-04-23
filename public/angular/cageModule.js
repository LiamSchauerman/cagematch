console.log('cageModule.js')
var app = angular.module('cageMatch', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'angular/views/matchup.html',
      controller: 'MatchupController'
    })
    .otherwise({
      redirectTo: '/'
    })
})

app.controller('MatchupController', function($scope, $window, matchup){
	if(!$window.actorId){
		$window.actorId = "nm0000115";
	}
	console.log('in matchup controller')
	matchup.set().then(function(resp){
		if(!$scope.movieA || $scope.movieA === ""){
			$scope.movieA = resp.data.movieA;
			$scope.movieB = resp.data.movieB;
		}
	})
	$scope.newmatchup = function($event){
		if($event.target.innerText.indexOf($scope.movieA.title) >= 0){
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
