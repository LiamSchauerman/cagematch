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
