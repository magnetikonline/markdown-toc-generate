(function() {

	'use strict';

	function $(id) { return document.getElementById(id); }

	function getHeaderListFromMarkdown(markdown) {

		var markdownLines = markdown.trim().split(/\r?\n/),
			headerList = [];

		markdownLines.forEach(function(line) {

			var headerMatch = line.trim().match(/^(#+) *(.+)/);
			if (headerMatch === null) return;

			headerList.push({
				level: headerMatch[1].length,
				text: headerMatch[2].trim()
			});
		});

		return headerList;
	}

	function getIndentWith(style) {

		return {
			'tab': '\t',
			'space-1': ' ',
			'space-2': '  ',
			'space-3': '   ',
			'space-4': '    '
		}[style];
	}

	function buildMarkdownPageAnchor(text) {

		return text
			.toLowerCase()
			.replace(/[^a-z0-9- ]/g,'')
			.replace(/ /g,'-');
	}

	function buildTOCMarkdownFromHeaderList(headerList,indentWith) {

		var currentHeaderLevel = -1,
			currentIndent = -1,
			markdownTOC = '';

		headerList.forEach(function(item) {

			// adjust header level for next TOC item
			var headerLevel = item.level;
			if (headerLevel > currentHeaderLevel) {
				currentIndent++;

			} else if (headerLevel < currentHeaderLevel) {
				currentIndent -= (currentHeaderLevel - headerLevel);
				if (currentIndent < 0) currentIndent = 0;
			}

			// remember current header level
			currentHeaderLevel = headerLevel;

			// build TOC line
			for (var i = 0;i < currentIndent;i++) markdownTOC += indentWith;
			markdownTOC += '- [' + item.text + '](#' + buildMarkdownPageAnchor(item.text) + ')\n';
		});

		return markdownTOC;
	}

	// add click handler to 'Generate' button
	$('generate').addEventListener('click',function() {

		$('markdown-output').value = buildTOCMarkdownFromHeaderList(
			getHeaderListFromMarkdown($('markdown-source').value),
			getIndentWith($('indent-style').value)
		);
	});
})();
