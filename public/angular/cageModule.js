console.log('cageModule.js')
var app = angular.module('cageMatch', ['ui.router'])
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
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
})

app.controller("RankingsController", function($scope, $window, Movies){
	console.log('rank controller')

	Movies($window.actorId).then(function(resp){
		$scope.movies = resp.data.collection.sort(function(a,b){return b.score-a.score});;
		update($scope.movies)
	})
	var timer = setInterval(function(){
		Movies($window.actorId).then(function(resp){
			$scope.movies = resp.data.collection.sort(function(a,b){return b.score-a.score});
			update($scope.movies)
		})
	}, 4000)
	
	function update(movies){
		// debugger;
		var rectangles = d3.select('#rankingsView svg').selectAll('rect').data(movies, function(d){return d.title})
		rectangles.exit().remove();
		rectangles.enter().append('rect')
			.attr({
				width : function(d){ return 30 * d.score / 120-100},
				height : 25,
				fill : "#f39817",
				x : 0,
				y : function(d,i){ return 26*i}
			})
			.text(function(d){return d.title})
			.on('mouseover', function(d){
			    var nodeSelection = d3.select(this);
			    console.log(nodeSelection[0][0].__data__.title, nodeSelection[0][0].__data__.score)
			})
		rectangles
			.transition().duration(800)
			.attr({
				width : function(d){ return 30 * d.score / 120 - 100},
				height : 25,
				fill : "#f39817",
				x : 0,
				y : function(d,i){ return 26*i}
			})
		rectangles.append('text')
			.attr({fill : "#000000",color:"white"})
			.attr("font-family", "sans-serif")
			.attr("font-size", "20px")
			.attr("fill", "red")
			.text(function(d){return d.title+" "+d.score})

	}

})
app.controller('MatchupController', function($scope, $window, matchup){
	console.log('matchup controller');
	if(!$window.actorId){
		$window.actorId = "nm0000115";
	}
	$scope.newId = "";

	matchup.set().then(function(resp){
		if(!$scope.movieA || $scope.movieA === ""){
			$scope.movieA = resp.data.movieA;
			$scope.movieB = resp.data.movieB;
		}
	})
	$scope.newmatchup = function(clicked){
		if($scope.movieA && clicked.title === $scope.movieA.title){
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
	$scope.neither = function(movieA,movieB){
		$.get('/draw?a='+movieA.title+"&b="+movieB.title, function(resp){
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
		url: '/actorList'
	}).then(function(resp){
		$scope.actors = resp.data.collection
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

app.factory('Movies', ['$http', '$window', function($http, $window){
	// return a method to get list of movies
	return function(id){
		return $http({
			method : "GET",
			url : "/movies?id="+id
		})
	}
}]);

