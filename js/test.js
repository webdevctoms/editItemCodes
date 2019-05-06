Tests = {
	checkCryeCodes
};

//check crye adjusted item codes
function checkCryeCodes(arr){
	console.log("checking crye item codes");
	let cryePattern = /crye/i;
	const twoDigitPattern = /\d{2}[XLRS]{2}|\d{2}[XLRS]{1}/i;
	const oneDigitPattern = /\d{1}[a-zA-Z]{3}/;
	const threeLetterPattern = /[XLRSMDG]{1}[XLRSMDG]{1}[XLRS]{1}/;
	let failedItems = [];
	for(let i = 0;i < arr.length;i++){
		if(i !== 0){
			let row = arr[i];
			let itemCode = row[0];
			let vendor = row[5];
			if(twoDigitPattern.test(itemCode) && cryePattern.test(vendor)){
				failedItems.push(itemCode);
			}				
				
			else if(oneDigitPattern.test(itemCode) && cryePattern.test(vendor)){
				failedItems.push(itemCode);
			}

			else if(threeLetterPattern.test(itemCode) && cryePattern.test(vendor)){
				failedItems.push(itemCode);
			}
		}	
	}

	if(failedItems.length > 0){
		console.log("Crye item code test failed: ",failedItems);
	}else{
		console.log("crye item code test passed")
	}
}