function analyse(text) {
	var freqs = {};
	
	for (var i=0; i<text.length; i++) {
		var ch = text.charAt(i);
		if (!(ch in freqs)) {
			freqs[ch] = 1;
		}
		else {
			freqs[ch] += 1;
		}
	}
	
	return freqs;
}

function buildPriorityQueue(freqs) {
	heapReset();
	var trees = {}
	for (var ch in freqs) {
		heapAdd({"value":ch, "freq":freqs[ch]});
		trees[ch] = {"freq":freqs[ch], "left":null, "right":null};
	}
	
	return trees;
}

function buildHuffmanTree(trees) {
	while (heapLength() >= 2) {
		var heapEntry1 = heapGet();
		var heapEntry2 = heapGet();
		var treeEntry1 = trees[heapEntry1["value"]];
		var treeEntry2 = trees[heapEntry2["value"]];
		
		var combinedFreq = heapEntry1["freq"] + heapEntry2["freq"];
		var combinedName = heapEntry1["value"] + heapEntry2["value"];
		
		trees[combinedName] = {"freq":combinedFreq, "left":heapEntry1["value"], "right":heapEntry2["value"]};
		heapAdd({"value":combinedName, "freq":combinedFreq});
	}
	
	var lastItem = heapGet();
	return {"root":lastItem["value"], "fullTree":trees};
}

function normalEncode(input) {
	var result = "";
	for (var i=0; i<input.length; i++) {
		var charCode = input.charCodeAt(i);
		result += resolveChar(charCode);
	}
	return result;
}

function normalEncodeFormatted(input) {
	var result = "";
	
	var colorIdx = 0;
	var colors = ["#F99", "#99F"];
	
	for (var i=0; i<input.length; i++) {
		var charCode = input.charCodeAt(i);
		result += "<span style='background-color:" + colors[colorIdx] + "'>" + resolveChar(charCode) + "</span>";
		colorIdx = (colorIdx+1) % 2;
	}
	return result;
}

function encode(treeObj, input) {
	var result = "";
	for (var i=0; i<input.length; i++) {
		var ch = input.charAt(i);
		result += findChar(ch, treeObj);
	}
	
	return result;
}

function encodeFormatted(treeObj, input) {
	var result = "";
	
	var colorIdx = 0;
	var colors = ["#F99", "#99F"];
	
	for (var i=0; i<input.length; i++) {
		var ch = input.charAt(i);
		result += "<span style='background-color:" + colors[colorIdx] + "'>" + findChar(ch, treeObj) + "</span>";
		colorIdx = (colorIdx+1) % 2;
	}
	
	return result;
}

function findChar(ch, treeObj) {
	var result = "";
	var pos = treeObj["root"];
	while (true) {
		if (pos == ch && result == "") {
			// Only happens when there is only one symbol
			return "0";
		}
		if (pos == ch) {
			break;
		}
		var curr = treeObj["fullTree"][pos];
		if (curr["left"] != null && curr["left"].includes(ch)) {
			pos = curr["left"];
			result += "0";
		}
		else if (curr["right"] != null && curr["right"].includes(ch)) {
			pos = curr["right"];
			result += "1";
		}
		else {
			console.log("FATAL ERROR, EVERYTHING BROKE! Tried to look for " + ch + ". Search space: ");
			if (curr["left"] != null) {
				console.log("\t" + curr["left"]);
			}
			if (curr["right"] != null) {
				console.log("\t" + curr["right"]);
			}
			break;
		}
	}
	return result;
}

function resolveChar(code) {
	var output = "";
	for (var i=0; i<8; i++) {
		var mask = 1 << i;
		if (code & mask) {
			output += "1";
		}
		else {
			output += "0";
		}
	}
	return output;
}