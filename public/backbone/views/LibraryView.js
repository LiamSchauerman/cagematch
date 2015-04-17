var LibraryView = Backbone.View.extend({
	tagName: 'ul',
	className: "collection",
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.children().detach();
	}
})