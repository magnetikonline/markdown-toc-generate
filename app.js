(() => {

	'use strict';

	const MARKDOWN_LINK_MATCH_REGEXP = /\[([^\]]+)\]\([^\)]+\)/g,
		MARKDOWN_INLINE_CODE_START_END_REGEXP = /^`+[^`]+`+$/,

		CODE_BLOCK_INDENT_REGEXP = /^ {4,}|\t/,
		CODE_BLOCK_FENCED_REGEXP = /^```([a-z]+)?$/,

		HEADER_HASH_REGEXP = /^(#{1,6})( +.+)$/,
		HEADER_UNDERLINE_REGEXP = /^(=+|-+)$/;

	function $(id) {
		return document.getElementById(id);
	}

	function getMarkdownStripMeta(text) {
		// attempt to strip out [links](#url) segments, leaving just [links]
		// note: very basic, won't handle repeated [] or () segments in link values well
		text = text.replace(
			MARKDOWN_LINK_MATCH_REGEXP,
			(match,linkLabel) => linkLabel
		);

		// if text starts and ends with a *single set* of inline code backticks, remove then
		if (MARKDOWN_INLINE_CODE_START_END_REGEXP.test(text)) {
			text = text.substring(1,text.length -1);
		}

		return text;
	}

	function getHeaderListFromMarkdown(markdown) {
		const markdownLineList = markdown.trim().split(/\r?\n/),
			headerList = [];

		let codeBlockFenceActive = false,
			lineItemPrevious;

		function addItem(level,text) {
			headerList.push({
				level: level,
				text: text
			});

			lineItemPrevious = undefined;
		}

		// work over each markdown line
		for (const lineItem of markdownLineList) {
			// indented code block line? if so, skip.
			if (CODE_BLOCK_INDENT_REGEXP.test(lineItem)) {
				continue;
			}

			const lineItemTrim = lineItem.trim();

			// fenced code block start/end?
			if (CODE_BLOCK_FENCED_REGEXP.test(lineItemTrim)) {
				codeBlockFenceActive = !codeBlockFenceActive;
				continue;
			}

			if (codeBlockFenceActive) {
				// skip all lines within a fenced code block
				continue;
			}

			// line match hash header style?
			const headerHashMatch = HEADER_HASH_REGEXP.exec(lineItemTrim);
			if (headerHashMatch) {
				addItem(
					headerHashMatch[1].length, // heading level
					getMarkdownStripMeta(headerHashMatch[2].trim())
				);

				continue;
			}

			// line match underline header style?
			if (
				lineItemPrevious &&
				HEADER_UNDERLINE_REGEXP.test(lineItemTrim)
			) {
				addItem(
					// '=' = level 1 header, '-' = level 2
					(lineItemTrim[0] == '=') ? 1 : 2,
					getMarkdownStripMeta(lineItemPrevious)
				);

				continue;
			}

			lineItemPrevious = lineItemTrim;
		}

		return headerList;
	}

	function getIndentWith(style) {
		// if tab mode
		if (style == 'tab') {
			return '\t';
		}

		// spaces mode
		const match = /^space-([0-9])$/.exec(style);
		return ' '.repeat((match) ? match[1] : 1);
	}

	function getMarkdownPageAnchor(text) {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9-_ ]/g,'')
			.replace(/ /g,'-');
	}

	function buildTOCMarkdown(headerList,indentWith,skipFirst) {
		const pageAnchorSeenCollection = {};
		let currentHeaderLevel = -1,
			currentIndent = -1,
			markdownTOC = '';

		for (const headerItem of headerList) {
			// skip the first heading found?
			if (skipFirst) {
				skipFirst = false;
				continue;
			}

			// raise/lower indent level for next TOC item
			const headerLevel = headerItem.level;
			if (headerLevel > currentHeaderLevel) {
				currentIndent++;

			} else if (headerLevel < currentHeaderLevel) {
				currentIndent -= (currentHeaderLevel - headerLevel);
				currentIndent = Math.max(currentIndent,0);
			}

			currentHeaderLevel = headerLevel;

			let pageAnchor = getMarkdownPageAnchor(headerItem.text);
			if (pageAnchorSeenCollection[pageAnchor] === undefined) {
				// new page anchor
				pageAnchorSeenCollection[pageAnchor] = 1;

			} else {
				// add increment to an already seen pageAnchor name
				pageAnchor = `${pageAnchor}-${pageAnchorSeenCollection[pageAnchor]++}`;
			}

			// build TOC line
			markdownTOC += (
				indentWith.repeat(currentIndent) +
				`- [${headerItem.text}](#${pageAnchor})\n`
			);
		}

		return markdownTOC;
	}

	function copyFormElementToClipboard(el) {
		// select element, copy content to clipboard then un-focus/select
		el.select();
		document.execCommand('copy');
		window.getSelection().removeAllRanges();
		el.blur();
	}

	function main() {
		const tableOfContentsEl = $('table-of-contents');

		// determine if clipboard is available to browser
		if (
			document.queryCommandSupported &&
			document.queryCommandSupported('copy')
		) {
			const copyClipboardEl = $('copy-clipboard');

			// display copy to clipboard button, add click handler
			copyClipboardEl.parentNode.classList.remove('hide');
			copyClipboardEl.addEventListener(
				'click',
				copyFormElementToClipboard.bind(null,tableOfContentsEl)
			);
		}

		// add click handler to 'Generate' button
		$('generate').addEventListener('click',() => {
			tableOfContentsEl.value = buildTOCMarkdown(
				getHeaderListFromMarkdown($('markdown-source').value),
				getIndentWith($('indent-style').value),
				$('skip-first-heading').checked
			);
		});
	}

	if (document.readyState == 'loading') {
		document.addEventListener('DOMContentLoaded',main);
		return;
	}

	main();
})();
