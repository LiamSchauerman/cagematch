var AppView = Backbone.View.extend({

	initialize: function(){
		console.log('initializing appview');
		this.list = new LibraryView({collection: this.model.get('EntryList')})
	},
	render: function(){
		return this.$el.html(this.list.$el);
	}
})