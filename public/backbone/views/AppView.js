var AppView = Backbone.View.extend({

	initialize: function(){
		console.log('initializing appview');
		this.movieViewA = new MovieView({ model: this.model.get('movieA')})
		this.movieViewB = new MovieView({ model: this.model.get('movieB')})
		console.log(this.movieViewA)



		// this.list = new LibraryView({collection: this.model.get('EntryList')})
		// debugger;
		// this.matchupView = new MatchupView({collection: this.model.get("EntryList")})
		this.model.on('newMatchup', this.render, this)
	},
	render: function(){
		//populate movieA and movieB id's
		$("#movieA").html(this.movieViewA.render())
		$("#movieB").html(this.movieViewB.render())
	},

})