const assert = require('chai').assert;
const downloader = require('../src/downloader');
const { configureApp } = require('../src/configure');
const { createImage, createNetwork, runContainer } = require('../src/installer');
const { getCounts, getLogs, getArtifacts } = require('../src/verifier');
const { cleanUpContainers, cleanUpImage, cleanUpNetwork } = require('../src/cleaner');
const config = require('../build/utils/config.json');

const target_2 = config["splitter"]["outputs"]["tcp"][1]["host"];
const target_1 = config["splitter"]["outputs"]["tcp"][0]["host"];
const splitter = config["agent"]["outputs"]["tcp"]["host"];

describe('Ensure app is downloaded from GitHub', function() {
	it('should check app is downloaded from GitHub', function() {
		assert.isTrue(downloader(), 'Error: App is not downladed from GitHub.');
	});
});

describe('Apply configure options to downloaded app', function() {
	it('should apply configure options for agent mode', function() {
		assert.isTrue(configureApp('agent'), 'Error: Applying configure options for agent failed');
	});
	it('should apply configure options for splitter mode', function() {
		assert.isTrue(configureApp('splitter'), 'Error: Applying configure options for splitter failed');
	});
	it('should apply configure options for target mode', function() {
		assert.isTrue(configureApp('target'), 'Error: Applying configure options for target failed');
	});
});


describe('Create docker image and custom network',function() {
	it('should create docker image', function() {
		assert.isTrue(createImage(), 'Error: Docker image creation failed.');
	});
	it('should create custom network', function() {
		assert.isTrue(createNetwork(), 'Error: Docker custom network creation failed.');
	});
});

describe('Run the app on docker containers',function() {
	it('should run docker container for ' + target_2, function() {
		assert.isTrue(runContainer(target_2), 'Error: Running docker container for ' + target_2 + ' failed.');
	});
	it('should run docker container for ' + target_1, function() {
		assert.isTrue(runContainer(target_1), 'Error: Running docker container for ' + target_1 + ' failed.');
	});
	it('should run docker container for ' + splitter, function() {
		assert.isTrue(runContainer(splitter), 'Error: Running docker container for ' + splitter + ' failed.');
	});
	it('should run docker container for agent', function() {
		assert.isTrue(runContainer('agent'), 'Error: Running docker container for agent failed.');
	});
});

describe('Verify app ran successfully', function() {
	it('should get standard output log from ' + target_2 + ' into logs folder', function() {
		assert.isTrue(getLogs(target_2),'Error: Fetching standard output from ' + target_2 + ' failed.');
	});
	it('should get standard output log from ' + target_1 + ' into logs folder', function() {
		assert.isTrue(getLogs(target_1),'Error: Fetching standard output from ' + target_1 + ' failed.');
	});
	it('should get standard output log from ' + splitter + ' into logs folder', function() {
		assert.isTrue(getLogs(splitter),'Error: Fetching standard out put from ' + splitter + ' failed.');
	});
	it('should get standard output log from agent into logs folder', function() {
		assert.isTrue(getLogs('agent'),'Error: Fetching standard output from agent failed.');
	});
	it('should verify count of events on targets', function() {
		assert.equal(getCounts(), 1000000, 'Error: Event counts are not correct.');
	});	
	it('should get artifactsfrom ' + target_2 + ' into artifacts folder', function() {
		assert.isTrue(getArtifacts(target_2),'Error: Fetchi ng standard output from ' + target_2 + ' failed.');
	});
	it('should get artifacts from ' + target_1 + ' into artifacts folder', function() {
		assert.isTrue(getArtifacts(target_1),'Error: Fetching standard output from ' + target_1 + ' failed.');
	});
});

describe('Clean up containers, image and network ', function() {
	it('should remove docker containers', function() {
		assert.isTrue(cleanUpContainers(),'Error: Docker containers could not be cleaned up.');
	});
	it('should remove docker image', function() {
		assert.isTrue(cleanUpImage(),'Error: Docker image could not be cleaned up.');
	});
	it('should remove network', function() {
		assert.isTrue(cleanUpNetwork(),'Error: Network could not be cleaned up.');
	});
});
