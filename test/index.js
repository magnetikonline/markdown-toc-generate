'use strict';

const assert = require('assert').strict,
	app = require('../app.js');

{
	const testSuite = (methodSet) => {
		const testCaseList = [
			['!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~',''],
			['word !"#$%&\'()*+,./:;<=>?@[\\]^`{|}~ word','word  word'],

			// source: https://github.com/magnetikonline/markdown-toc-generate/issues/2#issue-416329701
			['查看所有容器运行状态','查看所有容器运行状态'],
			['容器发现（DNS）','容器发现DNS'],

			// source: https://github.com/nok/markdown-toc/issues/102
			['Краткое описание принципа работы','Краткое описание принципа работы'],
			['Этапы разработки','Этапы разработки']
		];

		for (const testCase of testCaseList) {
			assert.equal(
				methodSet.stripPunctuation(testCase[0]),
				testCase[1]
			);
		}
	};

	app(testSuite);
}
