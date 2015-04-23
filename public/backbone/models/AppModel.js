var AppModel = Backbone.Model.extend({
	initialize: function(params){
		var self = this;
		this.set('EntryList', params.list);
		this.setMatchup();
		console.log(this.attributes)
		this.get('EntryList').on('matchupWinner', function(e){
			console.log('matchup event');
			self.scoreMatchup(e)
			self.trigger('newMatchup');
		})
		this.on('newMatchup', function(){
			self.setMatchup();
		})
	},
	setMatchup: function(){
		// get two movies from EntryList
		// create two movieModels from those entries
		var movies = this.get("EntryList");
		var indexA = Math.floor(Math.random()*movies.length);
		var indexB = Math.floor(Math.random()*movies.length);
		if(movies.length){
			while(indexA === indexB){ 
				//no duplicates
				indexB = Math.floor(Math.random()*movies.length);
			}
		} else {
			alert('movies.length is 0')
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
			var victor = "movieA";
		} else {
			var winner = movieB.attributes.title;
			var loser = movieA.attributes.title;
			var victor = "movieB";
		}
		$.ajax({
			method:"POST",
			url:"/scoreMatchup",
			data:{
				actorId: window.actorId,
				winner: winner,
				loser: loser
			},
			success: function(resp){
				console.log("Matcup posted");
				debugger;
				// update these models
				
				if( victor === "movieB"){
					this.get('movieB').set('score', resp.winnerScore)
					this.get('movieA').set('score', resp.winnerScore)
				} else {
					this.get('movieA').set('score', resp.winnerScore)
					this.get('movieB').set('score', resp.winnerScore)
				}
			},
			error: function(err){
				debugger;
				console.log(err)
			}
		})
	}
})