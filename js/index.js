function App(){

}

App.prototype.initApp = function() {
	console.log("initApp");
};

let app = new App();
window.onload = app.initApp();