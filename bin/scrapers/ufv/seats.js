


var time	=	SEAT_DATA.split('\n')[0].split(' ').filter(
	a => a!==""
)[3];

SEAT_DATA	=	SEAT_DATA.split('\n').filter(
	a => (a.split(' ')[1]&&a.split(' ')[1].match(/(\d\d\d\d\d)/g)!==null)
).map(
	a => a.split('|').map(
		a => a.trim()
	)
);