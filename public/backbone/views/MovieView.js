var MovieView = Backbone.View.extend({
	tagName: 'li',
	className: "movie col m3 yellow entryView",
	template: _.template('<%= title %>'),
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