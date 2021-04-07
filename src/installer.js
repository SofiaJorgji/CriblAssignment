const shell = require('shelljs');
const networkName = 'cribl-net';
const imageName = 'cribl-image'

exports.networkName = networkName;
exports.imageName = imageName;

exports.createImage = function() {
	try {
		const home = process.env.INIT_CWD;
		const utils = home + '/build/utils';
		const appDir = home + '/build/assignment';
		shell.cd(appDir);
		shell.cp(utils + '/Dockerfile', appDir + '/Dockerfile');
		shell.cp(utils + '/package.json', appDir + '/package.json');
		const imageLookup = 'docker image ls ' + imageName + "  | wc | awk '{print $1}'";
		if (parseInt(shell.exec(imageLookup, { silent: true }).stdout) > 1) {
			console.log('Removing old docker image: ' + imageName);
			const deleteImage = 'docker image rm ' + imageName;
			var msg = shell.exec(deleteImage, { silent: true }).stdout;
		}

		console.log('Building new docker image: ' + imageName);
		const buildImage = 'docker build -t ' + imageName + '  .';
		if (shell.exec(buildImage, { silent: true }).code !== 0) {
			shell.echo('Error: Docker image build failed');
  			shell.exit(1);
		}

		return (parseInt(shell.exec(imageLookup, { silent: true }).stdout) > 1);

	} catch(e) {
		console.error(e.message);
		return false;
	}
}

exports.createNetwork = function() {
	try {
		const networkLookup = 'docker network ls -f name=' + networkName + "  | wc | awk '{print $1}'";

		if (parseInt(shell.exec(networkLookup, { silent: true }).stdout) > 1) {
			console.log('Custom network ' + networkName + ' exists');
		} else {
			console.log('Creating new docker network: ' + networkName);
			const createNetwork = 'docker network create -d bridge ' + networkName;
			if (shell.exec(createNetwork, { silent: true }).code !== 0) {
				shell.echo('Error: Docker network creation failed');
  				shell.exit(1);
			}
		}
		return (parseInt(shell.exec(networkLookup, { silent: true }).stdout) > 1);

	} catch(e) {
		console.error(e.message);
		return false;
	}
}

exports.runContainer = function(containerName) {
	try {
		let mode = '';
		if (containerName.includes('agent')) {
			mode = 'agent';
		} else if (containerName.includes('splitter')) {
			mode = 'splitter';
		} else if (containerName.includes('target')) {
			mode = 'target';
		} else {
			console.log('Invalid option for container name!');
			return false;
		}

		const containerLookup = 'docker container ps -a | grep ' + containerName + "  | wc | awk '{print $1}'";
		if (parseInt(shell.exec(containerLookup, { silent: true }).stdout) > 0) {
			console.log('Removing old docker container : ' + containerName);
			const deleteContainer = 'docker rm -f ' + containerName;
			let msg = shell.exec(deleteContainer, { silent: true }).stdout;
		}

		console.log('Launching new docker container : ' + containerName);
		const launchContainer = 'docker run -d --network=' + networkName + '  --env FOLDER=' + mode + '  --name ' + containerName + '   ' + imageName;
		if (shell.exec(launchContainer, { silent: true }).code !== 0) {
			shell.echo('Error: Docker container start failed.');
  			shell.exit(1);
		}

		return (parseInt(shell.exec(containerLookup, { silent: true }).stdout) > 0);
	} catch(e) {
		console.error(e.message);
		return false;
	}
}
