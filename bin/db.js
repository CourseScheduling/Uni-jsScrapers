var mysql      = require('mysql');
var connection = mysql.createConnection({
  /*
    host     : 'schedule.cpfi2ocm03x0.us-west-2.rds.amazonaws.com',
    user     : 'joseph',
    password : 'joseph123',
    database : 'ufv'
  */
	host	:	'localhost',
	user	:	'root',
	password	:	'joseph'
});
connection.connect();
var blah	=	{
	query:function(sql,vals,done){
		connection.query(sql,vals,done);
	},
	insert:function(table,values,done){
		var columns	=	"";
		var questions	=	"";
		var stuffArray	=	[];
		for(var i in values){
			stuffArray.push(values[i]);
			columns+=(i+',');
			questions+="?,";
		}
		columns	=	columns.slice(0,-1);
		questions	=	questions.slice(0,-1);
		connection.query('INSERT INTO '+table+' ('+columns+') VALUES ('+questions+')',stuffArray,done);
	}
}
module.exports = blah;
