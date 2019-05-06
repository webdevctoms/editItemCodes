function EditItemCodes(commaSplitArr){
	this.commaSplitArr = commaSplitArr
	this.vendorIndex = this.getVendorIndex(this.commaSplitArr);

}

EditItemCodes.prototype.getVendorIndex = function(arr){
	//loop through the titles and find vendor
	for(let row = 0; row < arr[0].length; row++){	
		if(arr[0][row].toLowerCase() === "vendor,"){
			return row;
		}
	}

	return null;

};

//only fix crye item codes for now
EditItemCodes.prototype.fixItemCodesCrye = function(itemCode,vendor){
	//2 digits will represent waist size and 2 letters length of pant
	//fix waist size mixed with pant length 
	//eg 50000-BK-42R
	//eg 28-xl or 28-l
	let cryePattern = /crye/i;
	let newItemCode = itemCode;
	const twoDigitPattern = /\d{2}[XLRS]{2}|\d{2}[XLRS]{1}/i;
	//these should be 2xl etc and the last digit should be length
	//fix shirt size mixed with length with only 1 digit
	//eg 50025-RG-2XLL
	//eg 2xl-r
	const oneDigitPattern = /\d{1}[a-zA-Z]{3}/;
	//50001-MC-2XR  need pattern for these?
	const oneDigitPattern2 = /\d{1}[a-zA-Z]{2}/;
	//these should be XL plus length
	//fix shirt size mixed with length with no digits
	//50001-BK-LGL
	//eg xl-l
	const threeLetterPattern = /[XLRSMDG]{1}[XLRSMDG]{1}[XLRS]{1}/;
	let spliceIndex = 0;
	let splitItemCode = itemCode.split("-");
	let subString = splitItemCode[splitItemCode.length - 1];
	let newSubString;
	if(twoDigitPattern.test(itemCode) && cryePattern.test(vendor)){
		spliceIndex = 2;
		newSubString = this.fixItemCodeSubString(subString,spliceIndex);
		splitItemCode[splitItemCode.length - 1] = newSubString;

	}				
		
	else if(oneDigitPattern.test(itemCode) && cryePattern.test(vendor)){
		spliceIndex = 3;
		newSubString = this.fixItemCodeSubString(subString,spliceIndex);
		splitItemCode[splitItemCode.length - 1] = newSubString;
		
	}

	else if(threeLetterPattern.test(itemCode) && cryePattern.test(vendor)){
		spliceIndex = 2;
		newSubString = this.fixItemCodeSubString(subString,spliceIndex);
		splitItemCode[splitItemCode.length - 1] = newSubString;
		
	}		

	newItemCode = splitItemCode.join("-");
	return newItemCode;
};

EditItemCodes.prototype.adjustItemCodes = function(arr){
	
	for(let i = 1;i < arr.length;i++){
		arr[i][0] = arr[i][0].replace(/\s/g,"_").replace(/\//g,".").replace(/\-\-/g,"-").toUpperCase();
	}
};