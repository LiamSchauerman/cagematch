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

app.controller("RankingsController", function(Actors, $scope, $window, Movies){
	console.log('rank controller')
	Actors.getName($window.actorId).then(function(resp){
		$scope.currentActor = resp.data.name
	});

	Movies($window.actorId).then(function(resp){
		$scope.movies = resp.data.collection.sort(function(a,b){return b.score-a.score});
		render($scope.movies)
	});
	var timer = setInterval(function(){
		Movies($window.actorId).then(function(resp){
			$scope.movies = resp.data.collection.sort(function(a,b){return b.score-a.score});
			render($scope.movies)
		})
	}, 4000);
	
	function render(movies){
		var height = 25;
		var svg = d3.select("#rankingsView svg")
		var rectangles = svg.selectAll('g').data(movies, function(d){return d.title});
		rectangles.exit().remove();
		var group = rectangles.enter().append('g')
			.attr({
				transform : function(d, i) { return "translate(0," + i * 1.2 * height + ")"}
			});
		group.append('rect')
			.attr({
				fill: "#f39817",
				width: 0
			})
			.transition().duration(800)
			.attr({
				width : function(d){ return 30 * d.score / 120-100},
				height : height,
				fill : "#f39817",
			})
		group.append('text')
			.attr({
				fill: "#000000",
				x : 5,
				y : 20
			})
			.text(function(d){return d.title})
		rectangles.transition().duration(800)
			.attr({
				translate : function(d, i) { return "translate(0," + i * 1.2 * height + ")"},
				width : function(d){ return 30 * d.score / 120-100}

			})
	}
		// var rectangles = d3.select('#rankingsView svg').selectAll('rect').data(movies, function(d){return d.title})


/*		gs.exit().remove();
		gs.enter().append('g').attr({
			x : 0,
			y : function(d,i){ return 26*i},
		})
		gs.enter().append('rect')
			.attr({
				fill: "#f39817",
				width: 0
			})
			.transition().duration(800)
			.attr({
				width : function(d){ return 30 * d.score / 120-100},
				height : height,
				fill : "#f39817",
			})
		gs.enter().append('text')
			.attr({
				fill: "#09c3df"
			})
		gs
			.on('mouseover', function(d){
			    var nodeSelection = d3.select(this);
			    console.log(nodeSelection[0][0].__data__.title, nodeSelection[0][0].__data__.score)
			    $(this).css('fill', "#09c3df");
			})
			.on('mouseout', function(d){
			    $(this).css('fill', "#f39817");
			})

			*/



		// rectangles
		// 	.transition().duration(800)
		// 	.attr({
		// 		width : function(d){ return 30 * d.score / 120 - 100},
		// 		height : height,
		// 		fill : "#f39817",
		// 		x : 0,
		// 		y : function(d,i){ return 1.1*height*i},
		// 	})
	function update(movies){
		var height = 25;
		var svg = d3.select("#rankingsView svg")
		var bars = d3.selectAll('g').data(movies, function(d){return d.title})
		bars.exit().remove();
		bars.transition().duration(800)
			.attr({
				translate : function(d, i) { return "translate(0," + i * 1.2 * height + ")"}
			})
	}

})
app.controller('MatchupController', function($scope, $window, matchup, Actors){
	console.log('matchup controller');
	if(!$window.actorId){
		$window.actorId = "nm0000115"; // nic cage
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

	$scope.neither = function(movieA,movieB){
		$.get('/draw?a='+movieA.title+"&b="+movieB.title, function(resp){
			matchup.set().then(function(resp){
				$scope.movieA = resp.data.movieA;
				$scope.movieB = resp.data.movieB;
			})
		})
	}
})

app.controller("ActorController", function($scope, Actors, $state, $window, $http, matchup){
	console.log('actor controller');
	$scope.setActor = function(obj){
		if(typeof obj === "string"){
			$window.actorId = obj
		} else {
			$window.actorId = obj.imdbId;
		}
		$state.reload();
	};
	$http({
		method: 'GET',
		url: '/actorList'
	}).then(function(resp){
		$scope.actors = resp.data.collection.sort(function(a,b){
			return b.matchupCount - a.matchupCount
		})
		getAllTopMovies(function(){
			$scope.actors.sort(function(a,b){
				return b.matchupCount - a.matchupCount
			})
			
		})
	})
	$scope.queryActor = function(){
		// set windowActorId
		var id = $scope.newId

		$.get('/getCollection?id='+id, function(actorId){
			$window.actorId = actorId;
			$.get('/photos?id='+actorId);
			$scope.setActor(actorId)
			// set loading animation

			// matchup.set().then(function(resp){
			// 	$scope.movieA = resp.data.movieA;
			// 	$scope.movieB = resp.data.movieB;
			// })

		})
	}
	function getAllTopMovies(cb){
		Actors.numberOfVotes().then(function(resp){
			for(var i=0; i< $scope.actors.length; i++){
				$scope.actors[i].matchupCount = resp.data.pairs[$scope.actors[i].imdbId]
			}
			cb();
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

app.factory('Movies', ['$http', '$window', function($http, $window){
	// return a method to get list of movies
	return function(id){
		return $http({
			method : "GET",
			url : "/movies?id="+id
		})
	}
}]);

app.factory('Actors', ['$http', '$window', function($http, $window){
	// return a set of key value pairs
	// [actorId : topMovie]
	function numberOfVotes(id){
		return $http({
			method : "GET",
			url : "/countMatchups"
		})
	}
	function getName(id){
		return $http({
			method : "GET",
			url : "/actor?id="+id
		})
	}
	return {
		numberOfVotes : numberOfVotes,
		getName : getName
	}
}])

