var imdbResponse = document.createElement('div');
var titles = [];
$(document).on('ready', function(){
	var actorId = "nm0000115";
	window.queryByActor = function(id){
		$.get('/getActorCollection?id='+id, function(response){
			debugger;
			if(typeof response === "string"){
				imdbResponse.innerHTML = response;
				var cagedWisdom = parseHTML(imdbResponse);
				// post this array to server then to db
				$.ajax({
					method: 'POST',
					url: '/postActorCollection',
					data: {
						collection: cagedWisdom,
						imdbId: id
					},
					dataType: 'application/json'
				})
			} else {
				var cagedWisdom = response.actorCollection.movies;
			}
			console.log(cagedWisdom);
			window.actorId = id;
			var cageMovies = new EntryCollection(cagedWisdom);
			var app = new AppModel({list: cageMovies});
			var appView = new AppView({model: app});
			$('#container').html(appView.render());
		})
	}
	queryByActor(actorId);
	
});

$("#testButton").on('click', function(){
	var actorId = $("#query").val() || "nm0000115";
	queryByActor(actorId);
});
function parseHTML(element){
	// takes imdb html, returns an array of objects
	var children = imdbResponse.getElementsByClassName('filmo-category-section')[0].children;
	var data;
	for( var i=0; i<children.length; i++){
		var el = children[i].querySelector('b > a');
		if(el.innerHTML.indexOf('Amos') >= 0) continue;
		if(el.innerHTML.indexOf('Croods') >= 0) continue;
		data = {};
		if(children[i].querySelector('.year_column').innerHTML.match(/\d{4}/)){
			data.year = children[i].querySelector('.year_column').innerHTML.match(/\d{4}/)[0];
		}
		data.title = el.innerHTML;
		if( data.title.indexOf("'") >= 0 ){
			data.title = data.title.replace("'","");
		}
		var path = el.getAttribute('href');
		path = path.substring(path.indexOf('tt'), path.length);
		data.imdb_id = path.substring(0, path.indexOf('/'));
		titles.push(data);
	}
	return titles
};