# Markdown TOC generate
Client side Markdown table of contents (TOC) generator.

## Usage
- Paste source Markdown document into first textarea.
- Select options.
- Hit <kbd>Generate</kbd>.
- Final table of contents dropped into second textarea.
- Hit <kbd>Copy to clipboard</kbd> and you're done.

## Tests
Tests for `stripPunctuation()`, a JavaScript implementation of [CommonMark's](https://github.com/github/cmark-gfm) [`int cmark_utf8proc_is_punctuation(int32_t uc)`](https://github.com/github/cmark-gfm/blob/aed182ed089f1c4d42b75657064ae76904e9e024/src/utf8.c#L256-L317) function under [`test/`](test/).

Implementation of `stripPunctuation()` ensures generated links to headings are valid when dealing with characters/languages using extended UTF-8 character sets.

## Online
Available here: https://magnetikonline.github.io/markdown-toc-generate/.

Built and tested against Google Chrome (version 75).

## Reference
- https://github.com/github/cmark-gfm
- [`int cmark_utf8proc_is_punctuation(int32_t uc)`](https://github.com/github/cmark-gfm/blob/aed182ed089f1c4d42b75657064ae76904e9e024/src/utf8.c#L256-L317)
