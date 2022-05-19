function calculateHeight(treeObj) {
	return calculateHeightRecur(treeObj["fullTree"], treeObj["root"]);
}

function calculateHeightRecur(tree, idx) {
	if (tree[idx]["left"] == null && tree[idx]["right"] == null) {
		return 1;
	}
	
	var leftHeight = 0;
	var rightHeight = 0;
	if (tree[idx]["left"] != null) {
		leftHeight = calculateHeightRecur(tree, tree[idx]["left"]);
	}
	if (tree[idx]["right"] != null) {
		rightHeight = calculateHeightRecur(tree, tree[idx]["right"]);
	}
	
	var newHeight = 1 + (leftHeight>rightHeight? leftHeight : rightHeight);
	return newHeight;
}

function drawTree(canvas, treeObj) {
	var treeHeight = calculateHeight(treeObj);
	var heightPx = treeHeight * 64;
	
	var numLeaves = 1;
	for (var key in treeObj["fullTree"]) {
		if (key.length == 1) {
			numLeaves++;
		}
	}
	var widthPx = numLeaves * 64 * 2;
	
	canvas.width = widthPx;
	canvas.height = heightPx;
	
	var ctx = canvas.getContext("2d");
	ctx.font = "16px Sans-Serif";
	
	drawTreeRecur(ctx, treeObj["fullTree"], treeObj["root"], 0, 0, widthPx);
}

function drawTreeRecur(ctx, fullTree, currentNode, xOffset, height, allowableWidth) {
	
	var strAliased = currentNode;
	strAliased = strAliased.replace("\n", "\\n");
	strAliased = strAliased.replace("\t", "\\t");
	var rootLengthPx = ctx.measureText(strAliased)["width"];
	
	var xPos = ((allowableWidth / 2.0) + xOffset) - (rootLengthPx / 2.0);
	ctx.fillStyle = "#BBD";
	ctx.fillRect(xPos-2, height+16, rootLengthPx+4, 22);
	ctx.fillStyle = "#000";
	ctx.fillText(strAliased, xPos, height+32);
	
	if (fullTree[currentNode]["left"] != null) {
		ctx.beginPath();
		ctx.moveTo(xOffset + (allowableWidth / 2.0) - 3, height+40);
		ctx.lineTo(xOffset + (allowableWidth / 4.0), height+78);
		ctx.stroke();
		drawTreeRecur(ctx, fullTree, fullTree[currentNode]["left"], xOffset, height+64, allowableWidth / 2.0);
	}
	if (fullTree[currentNode]["right"] != null) {
		ctx.beginPath();
		ctx.moveTo(xOffset + (allowableWidth / 2.0) + 3, height+40);
		ctx.lineTo(xOffset + 3*(allowableWidth / 4.0), height+78);
		ctx.stroke();
		drawTreeRecur(ctx, fullTree, fullTree[currentNode]["right"], xOffset+(allowableWidth/2.0), height+64, allowableWidth / 2.0);
	}
}

function drawFreqTable(freqs, treeObj) {
	var resultTable = [];
	for (var ch in freqs) {
		var bitString = findChar(ch, treeObj);
		var charAlias = ch;
		switch(ch) {
			case "\n": charAlias = "<span class='aliasedChar'>\\n</span>"; break;
			case "\t": charAlias = "<span class='aliasedChar'>\\t</span>"; break;
			case " ": charAlias = "<span class='aliasedChar'>space</span>"; break;
		}
		resultTable.push( {"ch":charAlias, "freq":freqs[ch], "bitString":bitString} );
	}
	
	resultTable.sort(function(a,b) {
		var freqComp = b["freq"] - a["freq"];
		if (freqComp != 0) {
			return freqComp;
		}
		
		var lenComp = a["bitString"].length - b["bitString"].length;
		if (lenComp != 0) {
			return lenComp;
		}
		
		return a["charAlias"] < b["charAlias"];
	});
	
	var result = "<table><tr><th>Character</th><th>Frequency</th><th>Assignment</th><th>Space Savings</th></tr>";
	for (var i=0; i<resultTable.length; i++) {
		var current = resultTable[i];
		var savings = current["freq"]*8 - (current["freq"] * current["bitString"].length);
		var savingsString = "" + current["freq"] + "&times;8 - " + current["freq"] + "&times;" + current["bitString"].length + " = " + savings;
		result += "<tr><td>"+current["ch"]+"</td><td>"+current["freq"]+"</td><td>"+current["bitString"]+"</td><td>"+savingsString+" bits</td></tr>";
	}
	
	result += "</table>";
	return result;
}