var jsdom = require("jsdom");
var fs	=	require('fs');

var YEAR	=	"16";	//last 2 digits of 2000 year, e.g. 2012 = 12
var TERM	=	"WINT";	// can be WINT, FALL, SUMM
var CURRENT_CAMPUS	=	0;
var NEWLINE	=	';|;';
var INTERVAL_TIME	=	(i=>4000);	//the function to create an interval time.
var CAMPUSES	=	[
	"ABBOTS",	//Abbotsford campus
	"MISS",	//Mission Campus
	"CHWK",	//Chilliwack Campus
	"HOPE",	//Hope Campus
	"ONLINE",	//Online Campus
	"CT"	//Chilliwack Tech Campus
];


CAMPUSES.forEach(function(_campus,i,a){

	var dataString	=	[
		'./data/books.',
		_campus,
		'.',
		TERM,
		YEAR,
		'.dat'
	].join('');//get the url of the data file i.e. books.ABBOTS.WINT21.dat

	fs.readFile(dataString,function(e,d){
		if(d==undefined){
			//	If the books data file doesn't exist
				//	Fetch the book list,
			var books	=	EXT.fetchBookList(_campus,function(data){
				//	Store it in the books data file.
				fs.writeFile(dataString,data,function(e){
					if(e) throw e;
						//Do the main things ;)
					main(data);
				});
			});
		}else{
			//do the main thing ;)
			main(d);
		}
	});
	
});

var EXT	=	{
	fetchBookList:function(campus,cb){
		var url	=	[
			"http://ufv.bookware3000.ca/Course/course?campus=",
			campus,
			"&term=",
			TERM,YEAR,
			"&template=Json"
		].join('');//get the url for the current year parameters
		
		jsdom.env(url,
			["http://code.jquery.com/jquery.js"],
			function (err, window) {	
				var bookData	=	[];	//an array for all the book data
				window.$("li").each(function(i,a){
					bookData.push(a.id);
				});
				//add the id of all list elements to the book data
				cb&&cb(bookData.join(NEWLINE));
				//call it back 
			}
		);
	}
}








function main(data){
	
	var uniqs	=	data.split(NEWLINE);
	uniqCounter=0;
	
	var uniqInterval	=	setInterval(function(){
		
		if(uniqs.length	===	++uniqCounter)//clear the interval if done.
			return clearInterval(uniqInterval);
		
		var _uniq	=	uniqs[uniqCounter];	//get a uniq from the array
		
		var _uniqURL	=	[
			"http://ufv.bookware3000.ca/CourseSearch/?course[0]=",
			_uniq,';'
		].join('');	//create the url to the place where the books are
		
		
	},INTERVAL_TIME());
}