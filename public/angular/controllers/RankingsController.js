/**
 * Created by liam on 7/21/15.
 */
app.controller("RankingsController", function(Actors, $scope, $window, Movies){
    console.log('rank controller');
    Actors.getName($window.actorId).then(function(resp){
        $scope.currentActor = resp.data.name
    });

    Movies($window.actorId).then(function(resp){
        $scope.movies = resp.data.collection.sort(function(a,b){return b.score-a.score});
        update($scope.movies)
    });
    var timer = setInterval(function(){
        Movies($window.actorId).then(function(resp){
            $scope.movies = resp.data.collection.sort(function(a,b){return b.score-a.score});
            update($scope.movies)
        })
    }, 30000);

    function update(movies){
        var height = 20;
        var rectangles = d3.select('#rankingsView svg').selectAll('rect').data(movies, function(d){return d.title})
        rectangles.exit().remove();
        rectangles.enter().append('rect')
            .attr({
                fill: "#f39817",
                width: 0
            })
            .transition().duration(800)
            .attr({
                width : function(d){ return 30 * d.score / 120-100},
                height : height,
                fill : "#f39817",
                x : 0,
                y : function(d,i){ return 26*i},
            })
        rectangles
            .on('mouseover', function(d){
                var nodeSelection = d3.select(this);
                console.log(nodeSelection[0][0].__data__.title, nodeSelection[0][0].__data__.score)
                $(this).css('fill', "#09c3df");
            })
            .on('mouseout', function(d){
                $(this).css('fill', "#f39817");
            })
        rectangles
            .transition().duration(800)
            .attr({
                width : function(d){ return 30 * d.score / 120 - 100},
                height : height,
                fill : "#f39817",
                x : 0,
                y : function(d,i){ return 1.1*height*i},
            })
        $('.tooltipped').tooltip({delay: 50});

    }

});