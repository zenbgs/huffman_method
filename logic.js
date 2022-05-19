window.onload = function() {
	var encodeBtn = document.getElementById("encodeBtn");
	encodeBtn.onclick = function() {
		var inputString = document.getElementById("inputField").value;
	
		var makeLowerCase = document.getElementById("convertCaseCB").checked;
		if (makeLowerCase) {
			inputString = inputString.toLowerCase();
		}
	
		var freqs = analyse(inputString);
		var trees = buildPriorityQueue(freqs);
		var treeObj = buildHuffmanTree(trees);
		
		var normalString = normalEncode(inputString);
		var huffmanString = encode(treeObj, inputString);
		
		var result = "<strong>Unique Characters: </strong>" + Object.keys(freqs).length + "<br>";
		result += "<strong>Naive Encoding Length: </strong>" + normalString.length + " bits (assuming 8 bits per character)<br>";
		result += "<strong>Huffman Coded Length: </strong>" + huffmanString.length + " bits <br>";
		
		result += "<p><strong>Huffman Tree</strong> <button id='viewFull'>[View Full Size]</button><br>";
		result += "<canvas id='canvas'></canvas></p>";
		
		result += "<p><strong>Frequency Analysis</strong>";
		result += "<button id='freqShowBtn'>[Show]</button>";
		result += "<button id='freqHideBtn' style='display:none'>[Hide]</button>";
		result += "<div id='freqDiv' style='display:none'>" + drawFreqTable(freqs, treeObj) + "</div></p>";
		
		result += "<p><strong>Naive Coding </strong>";
		result += "<button id='naiveShowBtn'>[Show]</button>";
		result += "<button id='naiveHideBtn' style='display:none'>[Hide]</button><br>";
		result += "<div id='normEncDiv' style='display:none'>" + normalEncodeFormatted(inputString) + "</div></p>";
		
		result += "<p><strong>Huffman Coding </strong>";
		result += "<button id='huffShowBtn'>[Show]</button>";
		result += "<button id='huffHideBtn' style='display:none'>[Hide]</button><br>";
		result += "<div id='huffEncDiv' style='display:none'>" + encodeFormatted(treeObj, inputString) + "</div></p>";
		
		document.getElementById("result").innerHTML = result;
		
		var canvas = document.getElementById("canvas");
		drawTree(canvas, treeObj);
		
		var fullSizeLink = document.getElementById("viewFull");
		fullSizeLink.onclick = function() {
			window.open( canvas.toDataURL() );
		};
		
		if (canvas.width > window.innerWidth) {
			canvas.style.width = "99%";
			fullSizeLink.style.display = "inline";
		}
		else {
			fullSizeLink.style.display = "none";
		}
		
		document.getElementById("freqShowBtn").onclick = function(){
			document.getElementById("freqDiv").style.display = "block";
			document.getElementById("freqHideBtn").style.display = "inline";
			document.getElementById("freqShowBtn").style.display = "none";
		};
		
		document.getElementById("freqHideBtn").onclick = function(){
			document.getElementById("freqDiv").style.display = "none";
			document.getElementById("freqHideBtn").style.display = "none";
			document.getElementById("freqShowBtn").style.display = "inline";
		};
		
		document.getElementById("naiveShowBtn").onclick = function(){
			document.getElementById("normEncDiv").style.display = "block";
			document.getElementById("naiveHideBtn").style.display = "inline";
			document.getElementById("naiveShowBtn").style.display = "none";
		};
		
		document.getElementById("naiveHideBtn").onclick = function(){
			document.getElementById("normEncDiv").style.display = "none";
			document.getElementById("naiveHideBtn").style.display = "none";
			document.getElementById("naiveShowBtn").style.display = "inline";
		};
		
		document.getElementById("huffShowBtn").onclick = function(){
			document.getElementById("huffEncDiv").style.display = "block";
			document.getElementById("huffHideBtn").style.display = "inline";
			document.getElementById("huffShowBtn").style.display = "none";
		};
		
		document.getElementById("huffHideBtn").onclick = function(){
			document.getElementById("huffEncDiv").style.display = "none";
			document.getElementById("huffHideBtn").style.display = "none";
			document.getElementById("huffShowBtn").style.display = "inline";
		};
	}
	
	document.getElementById("hideDescBtn").onclick = function() {
		document.getElementById("description").style.display = "none";
		document.getElementById("showDescBtn").style.display = "block";
	};
	
	document.getElementById("showDescBtn").onclick = function() {
		document.getElementById("description").style.display = "block";
		document.getElementById("showDescBtn").style.display = "none";
	};
};