/**
 * Created by liam on 7/21/15.
 */
console.log(app);
debugger;
app.controller("ActorController", function($scope, Actors, $state, $window, $http, Matchup){
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
        });
        getAllTopMovies(function(){
            $scope.actors.sort(function(a,b){
                return b.matchupCount - a.matchupCount
            })

        })
    });

    $scope.queryActor = function(){
        // set windowActorId
        var id = $scope.newId;

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
    };
    function getAllTopMovies(cb){
        Actors.numberOfVotes().then(function(resp){
            for(var i=0; i< $scope.actors.length; i++){
                $scope.actors[i].matchupCount = resp.data.pairs[$scope.actors[i].imdbId]
            }
            cb();
        })
    }
})