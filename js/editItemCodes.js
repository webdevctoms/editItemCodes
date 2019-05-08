function EditItemCodes(commaSplitArr,itemCodeIdentifier,vendorIdentifier){
	this.commaSplitArr = commaSplitArr
	this.vendorIndex = this.getIndex(this.commaSplitArr,vendorIdentifier);
	this.itemCodeIndex = this.getIndex(this.commaSplitArr,itemCodeIdentifier);
	console.log("vendor, item code ",this.vendorIndex,this.itemCodeIndex);

}

EditItemCodes.prototype.getIndex = function(arr,identifier){
	//loop through the titles and find vendor
	for(let col = 0; col < arr[0].length; col++){	
		//console.log(arr[0][col].toLowerCase());
		if(arr[0][col].toLowerCase() === (identifier.toLowerCase() + ",")){
			return col;
		}
	}

	return null;
};

EditItemCodes.prototype.captureItemCodes = function(arr){
	let itemCodeArr = [];
	//loop through the titles and find vendor
	for(let row = 1; row < arr.length; row++){	
		itemCodeArr.push(arr[row][this.itemCodeIndex])
	}

	return itemCodeArr;
};

//return fixed sub string
EditItemCodes.prototype.fixItemCodeSubString = function(subString,index){
	let splitItem = subString.split("");
	splitItem.splice(index,0,"-");
	return splitItem.join("");
}

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

EditItemCodes.prototype.fixCryeCodes = function(arr){
	let cryeFixedArray = [];
	cryeFixedArray.push(arr[0]);
	if(this.vendorIndex){
		for(let row = 1; row < arr.length; row++){

			let newItemCode = this.fixItemCodesCrye(arr[row][0],arr[row][this.vendorIndex]);
			cryeFixedArray.push(arr[row]);
			cryeFixedArray[row][0] = newItemCode;
		}
	}
	else{
		console.log("Error no vendor index");
	}

	return cryeFixedArray;
	
};

EditItemCodes.prototype.adjustItemCodes = function(arr){
	
	for(let i = 1;i < arr.length;i++){
		arr[i][0] = arr[i][0].replace(/\s/g,"_").replace(/\//g,".").replace(/\-\-/g,"-").toUpperCase();
	}
};

EditItemCodes.prototype.removeDuplicateItemCodes = function(arr){
	let newArr = [];
	let copyIndexes = {};
	newArr.push(arr[0]);
	for(let i = 1;i < arr.length;i++){
		for(let k = 1;k < arr.length;k++){
			if(k > i){
				//duplicate found
				if(arr[i][0] === arr[k][0]){
					copyIndexes[k] = k;
					//console.log("dup at: ",i,k);
				}
			}
		}

		if(!copyIndexes[i]){
			newArr.push(arr[i]);
		}
		
	}

	return newArr;
};