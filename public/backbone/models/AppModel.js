var AppModel = Backbone.Model.extend({
	initialize: function(params){
		var self = this;
		this.set('EntryList', params.list);
		this.setMatchup();
		console.log(this.attributes)
		this.get('EntryList').on('matchupWinner', function(e){
			console.log('matchup event');
			self.scoreMatchup(e)
			self.setMatchup();
			// self.trigger('newMatchup');
		})
	},
	setMatchup: function(){
		// get two movies from EntryList
		// create two movieModels from those entries
		var movies = this.get("EntryList");
		var indexA = Math.floor(Math.random()*movies.length);
		var indexB = Math.floor(Math.random()*movies.length);
		while(indexA === indexB){ 
			//no duplicates
			indexB = Math.floor(Math.random()*movies.length);
		}
		this.set( "movieA", this.get('EntryList').at(indexA) );
		this.set( "movieB", this.get("EntryList").at(indexB) );
	},
	scoreMatchup: function(winner){
		// determine winner and loser
		// send titles to server
		var movieA = this.get('movieA');
		var movieB = this.get('movieB');
		if( winner.attributes.title === movieA.attributes.title ){
			var winner = movieA.attributes.title;
			var loser = movieB.attributes.title;
		} else {
			var winner = movieB.attributes.title;
			var loser = movieA.attributes.title;
		}
		$.ajax({
			method:"POST",
			url:"/scoreMatchup",
			data:{
				actorId: window.actorId,
				winner: winner,
				loser: loser
			},
			success: function(){
				console.log("Matcup posted")
			},
			error: function(err){
				console.log(err)
			}
		})
	}
})