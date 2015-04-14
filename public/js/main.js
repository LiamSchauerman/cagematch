console.log("main.js");
var list = ["tom cruise", 'jim carrey', 'adam sandler', 'will ferrell', 'chris farley'];
// var videos = new Videos(list);
var app = new AppModel({list: list});
var appView = new AppView({model: app});
$('#container').html(appView.render());