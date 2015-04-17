var MatchupView = Backbone.View.extend({
	initialize: function(){
		// this.html = "<%= title %>";
		// this.collection.on('change', this.render(), this)
	},
	tagname: 'ul',
	className: "matchupView",
	events: {
		click: function(e){console.log(e)}
	},
	className: "matchupView row",
	// template: _.template(this.html),
	render: function(){
		// this.$el.children().detach();
		// return this.$el.html("matchupView")
	    return this.$el
	}
})