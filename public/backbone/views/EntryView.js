var EntryView = Backbone.View.extend({
	tagName: 'li',
	className: "collection-item yellow entryView",
	template: _.template('<%= title %>'),
	events: {
		click: function(){
			var data = {title: this.model.attributes.title};
			console.log("Data",data)
		}
	},
	render: function(){
		return this.$el.html( this.template( this.model.attributes ) );
	}
})