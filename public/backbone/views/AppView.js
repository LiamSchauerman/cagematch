var AppView = Backbone.View.extend({

	initialize: function(){
		// this.list = new ListView({collection: this.model.get('List')})
		console.log('initialize')
	},
	render: function(){
		return this.$el.html(this.model.get('list').join("<br/>"))
	}
})