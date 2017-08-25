var countChar = function (data, search) {
	var target = data;
	var regexp = new RegExp('['+search+']', 'g');
	return (target.match(regexp) || []).length
}

var replaceAll = function(data, search, replacement) {
	var target = data;
	return target.split(search).join(replacement);
  //return target.replace(new RegExp('['+search+']', 'g'), replacement);
};


function ascendencia(filtro) {
	var result = [];
	var level = -1;
	var l,label;
	var breadcrumb = [];

	for (var i = 0 ; i < tax.length ; i++) {
		label = replaceAll(tax[i],'.','');		
		l = countChar(tax[i],'.');
		breadcrumb[l] = label;
		if (label == filtro) { 
			breadcrumb.length = l+1;
			break;
		}
	}

	return breadcrumb;
}

function descendencia(filtro) {
	var result = [];
	var level = -1;
	var l,label;
	
	for (var i = 0 ; i < tax.length ; i++) {
		if (replaceAll(tax[i], '.','') == filtro || level >= 0) {
			l = countChar(tax[i],'.');
			if (l <= level) break;
			label = replaceAll(tax[i],'.','');
			if (level == -1) level = l;
			result.push(label)
		}
	}

	return result;
}

function taxonomia(t) { tax = t; }
