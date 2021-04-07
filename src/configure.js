const fs = require('fs');
const shell = require('shelljs');
const networkName = 'cribl-net';
const imageName = 'cribl-image';

exports.networkName = networkName;
exports.imageName = imageName;

exports.configureApp = function(mode) {
	try {
		const homeDir = process.env.INIT_CWD;
		const utils = homeDir + '/build/utils';
		const appDir = homeDir + '/build/assignment';
		const modeDir = appDir + '/' + mode;
		const inputsFile = modeDir + '/inputs.json';
		const outputsFile = modeDir + '/outputs.json';
		const configFile = homeDir + '/build/utils/config.json';
		shell.cd(appDir);

		let configObj =  JSON.parse(fs.readFileSync(configFile));
		inputsObj = configObj[mode]["inputs"];
		outputsObj = configObj[mode]["outputs"];

		let inputOptions = JSON.stringify(inputsObj);
		fs.writeFileSync(inputsFile, inputOptions);

		let outputOptions = JSON.stringify(outputsObj);
		fs.writeFileSync(outputsFile, outputOptions);

		let configApplied = true;

		let writtenInputs = JSON.stringify(JSON.parse(fs.readFileSync(inputsFile)));
		configApplied = configApplied && (writtenInputs === inputOptions);

		let writtenOutputs = JSON.stringify(JSON.parse(fs.readFileSync(outputsFile)));
		configApplied = configApplied && (writtenOutputs === outputOptions);

		return configApplied;

	} catch(e) {
		console.error(e.message);
		return false;
	}
}
