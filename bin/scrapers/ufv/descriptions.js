var DB  =   require('./db.js');
var fs  =   require('fs');
var cheerio = require('cheerio');
var _   =   require('../../../global');
var requst  =   require('request');


var MAIN_URL    =   "https://www.ufv.ca/calendar/current/CourseDescriptions/[SUBJECT].htm";

DB.query('SELECT * FROM courses GROUP BY subject',function(e,r,v){
    r.forEach(function(v,i,a){
        _.get({
            url:MAIN_URL.replace('[SUBJECT]',v.subject+'P'),
            json:false,
            done:function(html){
                var dom =   cheerio.load(html);
                console.log(html);
            }
        });
    });
});
