function CaptureCSV(){
	this.commaSplitArr;
}

CaptureCSV.prototype.splitByCommas = function(newLineArr){
	//const commaRegex = /\"*(.*?)(?:\"*\,)/g;
	const commaRegex = /\"(.*?)(?<!\")(?:\"\,)|\"(.*?)(?:\"{3}\,)|(.*?)(?:\,)/g;
	let commaSplitArr = [];
	for(let i = 0;i < newLineArr.length;i++){
		//issues with matching 3 " so just remove any cases of 3 "
		let sanitizedString = newLineArr[i].replace(/\"{3}/g,'"').replace(/\#/g,"");
		let rowMatches = sanitizedString.match(commaRegex);
		commaSplitArr.push(rowMatches);		
	}
	
	return commaSplitArr;
};

CaptureCSV.prototype.addBlank = function(newLineArr){
	for(let i = 0;i < newLineArr.length;i++){
		newLineArr[i] = newLineArr[i].replace(/\r\n|\r|\n/,"");
		if(i === 0){
			
			newLineArr[i] += ",blank" + "\n";
		}
		else{
			newLineArr[i]+= "," + "\n";	
		}
	}
};

CaptureCSV.prototype.readFile = function(csvFile){
	let promise = new Promise((resolve,reject) => {
		let reader = new FileReader();

		reader.onload = function(event){
			let fileString = event.target.result;
			let newLineSplitFile = fileString.split("\n");
			this.addBlank(newLineSplitFile);
			this.commaSplitArr = this.splitByCommas(newLineSplitFile);

			if(this.commaSplitArr[this.commaSplitArr.length - 1].length === 1){
				this.commaSplitArr.pop();
			}
			resolve(this.commaSplitArr);
			
		}.bind(this);

		reader.readAsText(csvFile);
	});
	
	return promise;
};