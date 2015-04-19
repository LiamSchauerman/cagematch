var MovieView = Backbone.View.extend({
	tagName: 'li',
	initialize: function(){
		// this.listenTo(this.model, 'change', this.render);
	},
	className: "movie col s5 blue entryView",
	template: _.template('<%= title %><br><%= score %>'),
	events: {
		click: function(){
			console.log('clicked', this.model.attributes)
			this.model.win()
		}
	},
	render: function(){
		// debugger;
		// var html = this.model.attributes.title
		return this.$el.html(this.template(this.model.attributes))
	}
	
})