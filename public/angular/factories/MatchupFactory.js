app.factory('Matchup', ['$http', '$window', function($http, $window){
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