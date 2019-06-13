var handlebars = require('handlebars')

function breakLines(text){
	var moddedText = handlebars.Utils.escapeExpression(text)
	var newText = moddedText.replace(/(\n|\n\r|\r\n|\r)/g, '<br>')
	return new handlebars.SafeString(newText)
}

function arrayLength(text){
	var arr = text;
	
	if (arr != undefined){
		return String(arr.length)
	}else{
		return '-1'
	}
}

function notEmpty(text, options){
	var successFunction = options.fn
	var failFunction = options.inverse
	if (parseInt(arrayLength(text)) > 0){
		return successFunction(this)
	}else{
		return failFunction(this)
	}
}

module.exports = {
	breakLines: breakLines,
	arrayLength : arrayLength,
	notEmpty: notEmpty
}