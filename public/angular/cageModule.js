console.log('cageModule.js')
var app = angular.module('cageMatch', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
//   $routeProvider
//     .when('/', {
//       templateUrl: 'angular/views/matchup.html',
//       controller: 'MatchupController'
//     })
//     .otherwise({
//       redirectTo: '/'
//     })
	$stateProvider
		.state('home', {
		  url: "/home",
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
	$scope.queryActor = function(){
		// set windowActorId
		// if we dont have this actor, add it
		var id = $scope.newId
		$.get('/getCollection?id='+id, function(response){
			if(typeof response === "string"){
				// parse the string and send it back to server
				imdbResponse.innerHTML = response;
				var movieArray = parseHTML(imdbResponse);
				// post this array to server then to db
				$.ajax({
					method: 'POST',
					url: '/postCollection',
					data: {
						collection: movieArray,
						actorId: id
					},
					dataType: 'application/json',
					success: function(){
						 // $.get('/getCollection?id='+id, function(response){
						 // 	var movieArray = response.collection;
						 // 	console.log(movieArray);
						 	window.actorId = id;
						 	$.get('/photos?id='+actorId)
						 	matchup.set().then(function(resp){
					 			$scope.movieA = resp.data.movieA;
					 			$scope.movieB = resp.data.movieB;
						 	})						 // });
					},
					error: function(e){
						window.actorId = id;
						$.get('/photos?id='+actorId);
						matchup.set().then(function(resp){
							$scope.movieA = resp.data.movieA;
							$scope.movieB = resp.data.movieB;
						})
					}
				})
			} else {
				var movieArray = response.collection;
				console.log(movieArray);
				$window.actorId = id;
				matchup.set().then(function(resp){
					$scope.movieA = resp.data.movieA;
					$scope.movieB = resp.data.movieB;
				})
			}
		})
	// }

	}
})

app.controller("ActorController", function($scope, $http){
	console.log('actor controller');

	$http({
		method: 'GET',
		url: 'actorList'
	}).then(function(resp){
		debugger;
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
