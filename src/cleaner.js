const shell = require('shelljs');
const networkName = require('./installer').networkName;
const imageName = require('./installer').imageName;
const config = require('../build/utils/config.json');
const target_2 = config["splitter"]["outputs"]["tcp"][1]["host"];
const target_1 = config["splitter"]["outputs"]["tcp"][0]["host"];
const splitter = config["agent"]["outputs"]["tcp"]["host"];

exports.cleanUpContainers = function() {
	try {
		let cleanUpSuccess = true;
		['agent', splitter, target_1, target_2].forEach(function(containerName) {
			// Remove container
			const removeContainer = 'docker rm -f ' + containerName;
			let msg = shell.exec(removeContainer, { silent: true }).stdout;
			// Verify container is removed
			const containerLookup = 'docker container ls -f name=' + containerName + "  | wc | awk '{print $1}'"
			let status = (parseInt(shell.exec(containerLookup, { silent: true }).stdout) === 1);
			if (!status) {
				console.log('Removing container ' + containerName + ' failed');
			}
			cleanUpSuccess = cleanUpSuccess && status;
		});

		return cleanUpSuccess;
	} catch(e) {
		console.error(e.message);
		return false;
	}
}

exports.cleanUpImage = function() {
	try {
		let cleanUpSuccess = true;
		// Remove image
		const removeContainer = 'docker image rm ' + imageName;
		let msg = shell.exec(removeContainer, { silent: true }).stdout;

		// Verify image is removed
		const containerLookup = 'docker image ls ' + imageName + "  | wc | awk '{print $1}'";
		let status = (parseInt(shell.exec(containerLookup, { silent: true }).stdout) === 1);
		if (!status) {
			console.log('Removing image ' + imageName + ' failed');
		}
		cleanUpSuccess = cleanUpSuccess && status;

		return cleanUpSuccess;
	} catch(e) {
		console.error(e.message);
		return false;
	}
}

exports.cleanUpNetwork = function() {
	try {
		let cleanUpSuccess = true;	
		{
			// Remove created network		
			const removeContainer = 'docker network rm ' + networkName;
			let msg = shell.exec(removeContainer, { silent: true }).stdout;
			// Verify network is removed
			const containerLookup = 'docker network ls -f name=' + networkName + "  | wc | awk '{print $1}'"
			let status = (parseInt(shell.exec(containerLookup, { silent: true }).stdout) === 1);
			if (!status) {
				console.log('Removing network ' + networkName + ' failed');
			}
			cleanUpSuccess = cleanUpSuccess && status;
		}

		return cleanUpSuccess;
	} catch(e) {
		console.error(e.message);
		return false;
	}
}
