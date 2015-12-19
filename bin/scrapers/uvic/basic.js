var exec = require('child_process'),
    cmd  = 'php scraper.php';

//CRN!Subject!Course!Section!Credits!Name!Days!Time!Capacity!Actual!Remaining!WLCapacity!WLActual!WLRemaining!XLCapacity!XLActual!XLRemaining!Instructor!Date!Room


exec.exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
	console.log(error,stdout,stderr);
});