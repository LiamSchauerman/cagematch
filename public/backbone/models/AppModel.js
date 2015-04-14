var AppModel = Backbone.Model.extend({
	initialize: function(params){
		console.log(params)
		this.set('list', params.list)

		console.log(this.get('list'));
	}
})