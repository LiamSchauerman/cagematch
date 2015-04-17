var Movie = Backbone.Model.extend({
	initialize: function(){
		console.log("movies are great",this.attributes)
	},
	win: function(){
		// debugger;
		this.trigger('matchup', this);
	}
})