function App(dropZoneID,downloadID,testButtonID,filterDropZoneID,filterButtonID,itemID,vendorID,removeButtonID){
	this.csvDropZone = document.getElementById(dropZoneID);
	this.downloadLink = document.getElementById(downloadID);
	this.testButton = document.getElementById(testButtonID);
	this.filterDropZone = document.getElementById(filterDropZoneID);
	this.filterButton = document.getElementById(filterButtonID);
	this.itemCodeInput = document.getElementById(itemID);
	this.vendorInput = document.getElementById(vendorID);
	this.removeButton = document.getElementById(removeButtonID);

	this.commaSplitData;
	this.itemCodeFilterArray;
	this.noDupArray;
	this.captureCSV = new CaptureCSV();
	this.editItemCodes = new EditItemCodes();
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

	this.testButton.addEventListener("click",function(e){
		e.preventDefault();
		this.runTests();
	}.bind(this),false);

	this.filterButton.addEventListener("click",function(e){
		e.preventDefault();
		this.filterClicked();
	}.bind(this),false);

	this.removeButton.addEventListener("click",function(e){
		e.preventDefault();
		this.removeClicked();
	}.bind(this),false);

	this.filterDropZone.addEventListener("drop",function(e){
		e.preventDefault();
		this.filterFileDropped(e);
	}.bind(this),false);

	//need this to prevent default downloading of file
	this.filterDropZone.addEventListener("dragover",function(e){
		e.preventDefault();
	}.bind(this),false);
};

App.prototype.runTests = function(){
	console.log("run tests");
	try{
		Tests.checkLength(this.cryeEditedArray,this.commaSplitData[0].length);
		Tests.checkCryeCodes(this.cryeEditedArray);
		Tests.checkForDups(this.noDupArray);
	}
	catch(err){
		console.log("error testing ",err);
	}
};

App.prototype.filterClicked = function(){
	console.log("filter clicked");
	try{
		let filteredData = this.editItemCodes.removeByItemCode(this.noDupArray,this.itemCodeFilterArray);
		console.log(filteredData);
		let csvData = this.createBlob(filteredData);
		this.createDownload(csvData);
	}
	catch(err){
		console.log("error filtering ",err);
	}
};

App.prototype.removeClicked = function(){
	console.log("filter clicked");
	try{
		let csvData = this.createBlob(this.noDupArray);
		this.createDownload(csvData);
	}
	catch(err){
		console.log("error removing ",err);
	}
};

App.prototype.createBlob = function(arr){
	let lineArray = [];

	arr.forEach(function(rowArr,index){
		let row = rowArr.join("");
		lineArray.push(row);	
	});
	let csvContent = lineArray.join("\n");
	let csvData = new Blob([csvContent],{type:'text/csv'});
	let csvURL = URL.createObjectURL(csvData);
	return csvURL;
};

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
	return encodedUri;
};

App.prototype.createDownload = function(csvData){
	this.downloadLink.classList.remove("hide");
	this.downloadLink.setAttribute("href","");
	this.downloadLink.setAttribute("href",csvData);
	this.downloadLink.setAttribute("download", "new_data.csv");
};

App.prototype.filterFileDropped = function(event){
	let csvFile = event.dataTransfer.items[0].getAsFile();
	this.captureCSV.readFile(csvFile)

	.then(commaSplitData => {
		let filterByData = commaSplitData;
		
		let editItemCodes = new EditItemCodes(filterByData,"Name","vendor");
		editItemCodes.adjustItemCodes(filterByData);
		console.log(filterByData);
		let cryeEditedArray = editItemCodes.fixCryeCodes(filterByData);
		let noDupArray = editItemCodes.removeDuplicateItemCodes(cryeEditedArray);
		this.itemCodeFilterArray = editItemCodes.captureItemCodes(noDupArray);
		console.log(noDupArray);
		console.log("item codes ",this.itemCodeFilterArray);
	})

	.catch(err => {
		console.log("error reading file", err);
	});
	//console.log(this.commaSplitData);
};


App.prototype.fileDropped = function(event){
	let csvFile = event.dataTransfer.items[0].getAsFile();
	this.captureCSV.readFile(csvFile)

	.then(commaSplitData => {
		this.commaSplitData = commaSplitData;
		//console.log(this.commaSplitData);
		let itemCodeColumn = this.itemCodeInput.value;
		let vendorColumn = this.vendorInput.value;
		console.log(itemCodeColumn,vendorColumn);
		let editItemCodes = new EditItemCodes(this.commaSplitData,itemCodeColumn,vendorColumn);
		editItemCodes.adjustItemCodes(this.commaSplitData);
		this.cryeEditedArray = editItemCodes.fixCryeCodes(this.commaSplitData);
		console.log(this.cryeEditedArray);
		this.noDupArray = editItemCodes.removeDuplicateItemCodes(this.cryeEditedArray);
		console.log(this.noDupArray);
		let csvData = this.createBlob(this.cryeEditedArray);
		this.createDownload(csvData);
	})

	.catch(err => {
		console.log("error reading file", err);
	});
	//console.log(this.commaSplitData);
};

let app = new App("drop_zone","downloadLink","testData","drop_zone_filter","filterData","itemCodeColumn","vendorColumn","removeData");
window.onload = app.initApp();