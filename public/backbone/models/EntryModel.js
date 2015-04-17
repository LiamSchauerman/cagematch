var EntryModel = Backbone.Model.extend({
	initialize: function(){
		console.log(this.attributes);
	},
	win: function(model){console.log("winning",model)}
})