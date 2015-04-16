var AppModel = Backbone.Model.extend({
	initialize: function(params){
		console.log(params)
		this.set('EntryList', params.list)
	}
})