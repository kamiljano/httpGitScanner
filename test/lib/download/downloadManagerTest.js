'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const sinon = require('sinon');
chai.should();
const rewire = require('rewire');
const path = require('path');

describe('GIVEN downloadManager', () => {

  let manager;
  let parser;
  let pipe;
  let pipeStream;
  let driveManager;
  let request;
  const dotGitUrl = 'http://test/.git/';

  beforeEach(() => {
    driveManager = {
      initTempPath: sinon.stub(),
      writeStream: sinon.stub().callsFake(streamTarget => ({streamTarget}))
    };
    parser = {
      supports: () => true,
      parse: sinon.stub()
    };
    parser.parse.withArgs('root').returns({
      files: ['rootFile'],
      dirs: ['dir']
    });
    parser.parse.withArgs('dir').returns({
      files: ['dirFile'],
      dirs: []
    });
    request = sinon.stub();
    request.get = sinon.stub();
    request.get.withArgs(dotGitUrl).returns(Promise.resolve('root'));
    request.get.withArgs(`${dotGitUrl}dir/`).returns(Promise.resolve('dir'));
    pipe = sinon.stub();
    pipeStream = {
      on: sinon.stub()
    };
    pipe.returns(pipeStream);
    pipeStream.on.callsFake((eventType, callback) => {
      if (eventType === 'finish') {
        callback();
      }
    });
    request.withArgs(`${dotGitUrl}rootFile`).returns({pipe});
    request.withArgs(`${dotGitUrl}dir/dirFile`).returns({pipe});

    manager = rewire('../../../lib/download/downloadManager');
    manager.__set__({driveManager, request, parsers: [parser]});
  });

  it('WHEN the repository is hosted on a supported server, THEN it is successfully downloaded', async () => {
    await manager.downloadGitRepository(dotGitUrl);

    request.should.have.been.calledTwice;
    request.should.have.been.calledWith(`${dotGitUrl}rootFile`);
    request.should.have.been.calledWith(`${dotGitUrl}dir/dirFile`);
    pipe.should.have.been.calledTwice;
    pipe.should.have.been.calledWith({streamTarget: 'rootFile'});
    pipe.should.have.been.calledWith({streamTarget: path.join('dir', 'dirFile')});
  });

  it('WHEN the request to download a repository is issued, THEN the target directory has to be cleaned before downloading anything', async () => {
    await manager.downloadGitRepository(dotGitUrl);

    driveManager.initTempPath.should.have.been.calledOnce;
  });

  it('WHEN the repository is hosted on a server without directory browsing support, THEN nothing is downloaded', async () => {
    request.get.withArgs(dotGitUrl).returns(Promise.reject({}));
    let err;
    try {
      await manager.downloadGitRepository(dotGitUrl);
    } catch (e) {
      err = e;
    }
    err.should.not.be.undefined;
  });

});