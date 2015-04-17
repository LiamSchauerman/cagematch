var EntryCollection = Backbone.Collection.extend({

 	model: Movie,
 	initialize: function(){
 		this.on('matchup', function(){
 			console.log("entry collection hears matchup event")
 		})
 	}

	// setMatchup: function(){
		//get two random movies
	// 	var movies = this.models;
	// 	var indexA = Math.floor(Math.random()*movies.length);
	// 	var indexB = Math.floor(Math.random()*movies.length);
	// 	if(this.models.length){
	// 		while(indexA === indexB){ //no duplicates
	// 			indexB = Math.floor(Math.random()*movies.length);
	// 		}
			
	// 	}
	// 	// assign to attributes to track players
	// 	debugger;
	// 	this.set("titleA", this.where(indexA).attributes);
	// 	this.set("titleB", this.at(indexB).attributes);
	// 	console.log(this.get('titleA'));
	// 	console.log(this.get('titleB'));
	// }
});

// var movies = this.get("EntryList");
// var indexA = Math.floor(Math.random()*movies.length);
// var indexB = Math.floor(Math.random()*movies.length);
// while(indexA === indexB){ //no duplicates
// 	indexB = Math.floor(Math.random()*movies.length);
// }
// this.set("titleA", movies.at(indexA).attributes);
// this.set("titleB", movies.at(indexB).attributes);
// if( this.matchup ){
// 	this.matchup.pop();
// 	this.matchup.pop();
// 	this.matchup.add(this.get('titleA'));
// 	this.matchup.add(this.get('titleB'));
// } else {
// 	this.get('MatchupCollection').add(this.get('titleA'));
// 	this.get('MatchupCollection').add(this.get('titleB'));
// }
