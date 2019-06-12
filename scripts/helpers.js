var handlebars = require('handlebars')

function breakLines(text){
	var moddedText = handlebars.Utils.escapeExpression(text)
	var newText = moddedText.replace(/(\n|\n\r|\r\n|\r)/g, '<br>')
	return new handlebars.SafeString(newText)
}

module.exports = {
	breakLines: breakLines
}