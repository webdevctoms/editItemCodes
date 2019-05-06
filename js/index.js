function App(dropZoneID,downloadID,testButtonID){
	this.csvDropZone = document.getElementById(dropZoneID);
	this.downloadLink = document.getElementById(downloadID);
	this.testButton = document.getElementById(testButtonID);
	this.commaSplitData;
	this.captureCSV = new CaptureCSV();
	this.editItemCodes;
}

App.prototype.initApp = function() {
	this.csvDropZone.addEventListener("drop",function(e){
		e.preventDefault();
		this.fileDropped(e);
	}.bind(this),false);

	//need this to prevent default downloading of file
	this.csvDropZone.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);
	//console.log("start app");

	this.testButton.addEventListener("click",function(e){
		e.preventDefault();
		this.runTests();
	}.bind(this),false);
};

App.prototype.runTests = function(){
	console.log("run tests");
	//Tests.checkCryeCodes();
}

App.prototype.createCSV = function(arr){
	let lineArray = [];
	//console.log(arr);
	arr.forEach(function(rowArr,index){
		let row = rowArr.join("");
		lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + row:row);	
		//lineArray.push(row);
	});
	let csvContent = lineArray.join("\n");
	let encodedUri = encodeURI(csvContent);
	//console.log(csvContent);
	return encodedUri
};

App.prototype.createDownload = function(csvData){
	this.downloadLink.classList.remove("hide");
	this.downloadLink.setAttribute("href","");
	this.downloadLink.setAttribute("href",csvData);
	this.downloadLink.setAttribute("download", "new_data.csv");
};

App.prototype.fileDropped = function(event){
	let csvFile = event.dataTransfer.items[0].getAsFile();
	this.captureCSV.readFile(csvFile)

	.then(commaSplitData => {
		this.commaSplitData = commaSplitData;
		console.log(this.commaSplitData);
		this.editItemCodes = new EditItemCodes(this.commaSplitData);
		this.editItemCodes.adjustItemCodes(this.commaSplitData);
		
	})

	.catch(err => {
		console.log("error reading file", err);
	});
	//console.log(this.commaSplitData);
};

let app = new App("drop_zone","downloadLink","testData");
window.onload = app.initApp();