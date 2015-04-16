var imdbResponse = document.createElement('div');
var titles = [];
$("#testButton").on('click', function(){
	console.log('in click');
	$.get('/scrape', function(html){
		imdbResponse.innerHTML = html;
		var cagedWisdom = parseHTML(imdbResponse);
		console.log(cagedWisdom);
		var entries = new EntryCollection(cagedWisdom)
		var app = new AppModel({list: entries});
		var appView = new AppView({model: app});
		$('#container').html(appView.render());
	})
});
function parseHTML(element){
	// takes imdb html, returns an array of objects
	var children = imdbResponse.getElementsByClassName('filmo-category-section')[0].children;
	var data;
	for( var i=0; i<children.length; i++){
		// debugger;
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