//get list of movies
var list = [
	{title: "tom cruise"}, 
	{title:'jim carrey'}, 
	{title:'adam sandler'}, 
	{title:'will ferrell'}, 
	{title:'chris farley'}];
// var videos = new Videos(list);
var entries = new EntryCollection(list)
var app = new AppModel({list: entries});
var appView = new AppView({model: app});
console.log("WUT")
$('#container').html(appView.render());