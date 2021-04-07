const shell = require('shelljs');
const config = require('../build/utils/config.json');

const target_2 = config["splitter"]["outputs"]["tcp"][1]["host"];
const target_1 = config["splitter"]["outputs"]["tcp"][0]["host"];
const eventsFile = config["target"]["outputs"]["file"];

exports.getCounts = function() {
	try {
		const getEventCountTarget1 = "docker exec -t " + target_1 + " wc " + eventsFile + " | awk '{print $1}'";
		const getEventCountTarget2 = "docker exec -t " + target_2 + " wc " + eventsFile + " | awk '{print $1}'";

		let eventCountTarget1 = parseInt(shell.exec(getEventCountTarget1, { silent: true }).stdout);
		let eventCountTarget2 = parseInt(shell.exec(getEventCountTarget2, { silent: true }).stdout);
		console.log('Total counts:' + (eventCountTarget1 + eventCountTarget2));
		return (eventCountTarget1 + eventCountTarget2);
	} catch(e) {
		console.error(e.message);
		return false;
	}
}

exports.getLogs = function(containerName) {
	try {
		const logDir = process.env.INIT_CWD + '/logs';
		const logFile = containerName + '.stdout';

		shell.cd(logDir);
		
		let msg = shell.rm('-f', logFile);

		const getLogs = 'docker logs ' + containerName + '  >  ' + logDir + '/' + logFile;

		msg = shell.exec(getLogs, { silent: true }).stdout;

		return(shell.ls(logFile).includes(logFile));
	} catch(e) {
		console.error(e.message);
		return false;
	}
}

exports.getArtifacts = function(containerName) {
	try {
		const artifactsDir = process.env.INIT_CWD + '/artifacts';
		const artifactFile = containerName + '.events.log';

		shell.cd(artifactsDir);
		
		let msg = shell.rm('-f', artifactFile);

		const cmd1 = 'docker cp ' + containerName + ':/usr/src/app/'+eventsFile+'   '+ artifactsDir + '/' + artifactFile;

		msg = shell.exec(cmd1, { silent: true }).stdout;

		return(shell.ls(artifactFile).includes(artifactFile));

	} catch(e) {
		console.error(e.message);
		return false;
	}
}
