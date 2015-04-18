var EntryCollection = Backbone.Collection.extend({

 	model: Movie,
 	initialize: function(){
 		this.on('matchup', function(){
 			console.log("entry collection hears matchup event")
 		})
 	}
});
