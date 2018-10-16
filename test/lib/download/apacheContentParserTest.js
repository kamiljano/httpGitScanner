'use strict';

const chai = require('chai');
chai.should();
const fs = require('fs');
const apacheContentParserTest = require('../../../lib/download/apacheContentParser');

const apachePage = fs.readFileSync(__dirname + '/apachePage.html').toString('utf-8');
const apacheEmptyPage = fs.readFileSync(__dirname + '/apacheEmptyPage.html').toString('utf-8');

describe('GIVEN apacheContentParser', () => {

  it('WHEN providing with an apache page AND testing if the parser supports it, THEN it returns true', () => {
    apacheContentParserTest.supports(apachePage).should.equal(true);
  });

  it('WHEN providing with an apache page AND trying to parse, THEN it returns a parsed result', () => {
    apacheContentParserTest.parse(apachePage).should.deep.equal({
      dirs: [
        'branches',
        'hooks',
        'info',
        'objects',
        'refs'
      ],
      files: [
        'HEAD',
        'config',
        'description'
      ]
    });
  });

  it('WHEN providing with an apache page AND trying to parse despite the fact that the page does not contain any files, THEN it returns a parsed empty result', () => {
    apacheContentParserTest.parse(apacheEmptyPage).should.deep.equal({
      dirs: [],
      files: []
    });
  });

});