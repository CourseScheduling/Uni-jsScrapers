var dbParser	=	require('./dbParser');
var _	=	require('../../../global.js');

var BASE_URL	=	'https://www.uvic.ca/BAN2P/bwckschd.p_disp_dyn_sched';
_.get({
	url:'https://www.uvic.ca/BAN2P/bwckctlg.p_disp_listcrse?term_in=201601&subj_in=CHEM&crse_in=102&schd_in=',
	done:function(a){
				console.log(a);

}});




















/*


function parseTime(time){
	console.log(time);
	if(time==' '||time=='TBA'){
		return ['',''];
	}else{
		var time = time.split(' - ');
		return [ampm(time[0]),ampm(time[1])];
	}
}

	function ampm(time){
		var hours = Number(time.match(/^(\d+)/)[1]);
		var minutes = Number(time.match(/:(\d+)/)[1]);
		var AMPM = time.match(/\s(.*)$/)[1];
		if(AMPM == "pm" && hours<12) hours = hours+12;
		if(AMPM == "am" && hours==12) hours = hours-12;
		var sHours = hours.toString();
		var sMinutes = minutes.toString();
		if(hours<10) sHours = "0" + sHours;
		if(minutes<10) sMinutes = "0" + sMinutes;
		return sHours + ":" + sMinutes;
	}
	*/