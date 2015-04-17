var AppModel = Backbone.Model.extend({
	initialize: function(params){
		this.set('EntryList', params.list);
		this.setMatchup();
		console.log(this.attributes)
		this.get('EntryList').on('matchup', function(){
			console.log('matchup event');
			this.setMatchup();
			this.trigger('newMatchup');
		})
	},
	setMatchup: function(){
		// get two movies from EntryList
		// create two movieModels from those entries
		var movies = this.get("EntryList");
		var indexA = Math.floor(Math.random()*movies.length);
		var indexB = Math.floor(Math.random()*movies.length);
		while(indexA === indexB){ //no duplicates
			indexB = Math.floor(Math.random()*movies.length);
		}
		this.set("movieA", this.get('EntryList').at(indexA));
		this.set("movieB", this.get("EntryList").at(indexB));
	}
})