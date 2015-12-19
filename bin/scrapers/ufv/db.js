var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'schedule.cpfi2ocm03x0.us-west-2.rds.amazonaws.com',
    user     : 'joseph',
    password : 'joseph123'
});
connection.connect();

module.exports = connection;