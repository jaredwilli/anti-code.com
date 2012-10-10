if (typeof anti !== 'object') {
	var anti = {};
}

anti.Cloud = function(x, y) {

};
anti.canvas = {
	init: function(c) {
		//console.log(canvasCol);
		var ctx = c.getContext('2d');

		console.log(c, ctx);
	},
	cloud: function() {
		con.beginPath(); // begin custom shape
		con.moveTo(170, 80);
		BezCurve(130, 100, 130, 150, 230, 150);
		BezCurve(250, 180, 320, 180, 340, 150);
		BezCurve(420, 150, 420, 120, 390, 100);
		BezCurve(430, 40, 370, 30, 340, 50);
		BezCurve(320, 5, 250, 20, 250, 50);
		BezCurve(200, 5, 150, 20, 170, 80);
		con.closePath(); // complete custom shape
		con.lineWidth = 5;
		con.strokeStyle = 'rgba(0, 100, 200, .6)';
		con.stroke();
		con.fillStyle = 'white';
		con.fill();
	},
	gridLines: function(ctx) {
		// x axis grid lines
		for (var x = 50; x < 1300; x++) {
			ctx.moveTo(x, 0);
				ctx.lineTo( x, 400 );
		}
		// y axis grid lines
		for (var y = 50; y < 800; y++) {
			con.moveTo( 0, y );
			con.lineTo( 500, y );
		}
		con.strokeStyle = '#333';
		con.stroke();
	}	
};