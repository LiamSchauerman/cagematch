app.factory('Movies', ['$http', '$window', function($http, $window){
    // return a method to get list of movies
    return function(id){
        return $http({
            method : "GET",
            url : "/movies?id="+id
        })
    }
}]);