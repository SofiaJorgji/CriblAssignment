const shell = require('shelljs');

module.exports = function() {
	let files = [];
	try {
		const path = process.env.INIT_CWD + '/Build';
		shell.cd(path);
		shell.rm('-rf', 'assignment*');
		const assignment = 'git clone https://github.com/SofiaJorgji/assignment.git';
		if (shell.exec(assignment).code !== 0) {
			shell.echo('Error: Git clone failed');
  			shell.exit(1);
		}

		shell.ls().forEach(function(file) {
			files.push(file);
		});
	} catch(e) {
		console.error(e.message);
		return false;
	}
	return files.includes('assignment');	
}
