var AppModel = Backbone.Model.extend({
	initialize: function(params){
		this.set('List', params.list)

		console.log(this.get('List'));
	}
})