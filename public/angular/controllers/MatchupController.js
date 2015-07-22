app.controller('MatchupController', function($scope, $window, Matchup, Actors){
    console.log('matchup controller');
    if(!$window.actorId){
        $window.actorId = "nm0000115"; // nic cage
    }
    $scope.newId = "";

    Matchup.set().then(function(resp){
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
        Matchups.score(winner, loser, $window.actorId).then(function(a,b){
            Matchup.set().then(function(resp){
                $scope.movieA = resp.data.movieA;
                $scope.movieB = resp.data.movieB;
            })
        })
    };

    $scope.neither = function(movieA,movieB){
        $.get('/draw?a='+movieA.title+"&b="+movieB.title, function(resp){
            Matchup.set().then(function(resp){
                $scope.movieA = resp.data.movieA;
                $scope.movieB = resp.data.movieB;
            })
        })
    }
});