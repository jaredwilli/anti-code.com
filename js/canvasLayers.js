console.log('canvasLayers');

if (typeof anti.paper !== 'object') {
	window.anti.paper = {};
}

paper.install(anti.paper);
console.log(window.anti);

console.log(paper.project.view);
//var canvas = document.getElementById('big-clouds');
// Create an empty project and a view for the canvas:
//paper.setup(canvas);

anti.paper = {
	// The amount of symbol we want to place;
	var count = 20;

	function CloudFactory() {
	    var rndRect = new Path.RoundRectangle(new Rectangle(-25, 85, 500, 70), new Size(50, 70));
	    var circle1 = new Path.Circle(new Point(450, 110), 35);
	    var circle2 = new Path.Circle(new Point(370, 70), 65);
	    var circle3 = new Path.Circle(new Point(280, 25), 90);
	    var circle4 = new Path.Circle(new Point(205, 90), 65);
	    var circle5 = new Path.Circle(new Point(115, 70), 55);
	    var circle6 = new Path.Circle(new Point(55, 95), 40);
	    var circle7 = new Path.Circle(new Point(3, 115), 35);
	    
	    var group = new Group([rndRect, circle1, circle2, circle3, circle4, circle5, circle6, circle7]);
	    return group;
	}

	// Create a symbol, which we will use to place instances of later:
	var path = CloudFactory(); //new Path.Circle(new Point(0, 0), 50);

	path.style = {
	    fillColor: 'rgba(200,200,200,0.9)',
	    strokeColor: 'rgba(200,200,200,0.05)'
	};

	var symbol = new Symbol(path);

	// Place the instances of the symbol:
	for (var i = 0; i < count; i++) {
	    // The center position is a random point in the view:
	    var center = Point.random() * view.size;
	    var placed = symbol.place(center);

	    placed.scale(i / count);
	    placed.data = {};
	    placed.data.vector = new Point({
	        angle: Math.random() * 360,
	        length : (i / count) * Math.random() / 5
	    });
	}

	var vector = new Point({
	    angle: 45,
	    length: 0
	});

	var mouseVector = vector.clone();

	function onMouseMove(event) {
	//    mouseVector = view.center - event.point;
	}

	// The onFrame function is called up to 60 times a second:
	function onFrame(event) {
	    vector = vector + (mouseVector - vector) / 30;

	    // Run through the active layers children list and change
	    // the position of the placed symbols:
	    for (var i = 0; i < count; i++) {
	        var item = project.activeLayer.children[i];
	        var size = item.bounds.size;
	        var length = vector.length / 100 * size.width / 100;

	        item.position += vector.normalize(length) + item.data.vector;
	        keepInView(item);
	    }
	}

	function keepInView(item) {
	    var bounds = view.bounds;

	    //console.log(item);

	    // make edges mirror like in asteroids
	    if (item.bounds.x + item.bounds.width < bounds.x) {
	        item.position.x = bounds.width;
	    }
	    if (item.bounds.y + item.bounds.height < bounds.y) {
	        item.position.y = bounds.height;
	    }

	    if (item.bounds.x - item.bounds.width > bounds.width) {
	        //console.log(item.bounds);

	        item.position.x = 0;
	    }
	    if (item.bounds.y - item.bounds.height > bounds.height) {
	        item.position.y = 0;
	    }
	}
};