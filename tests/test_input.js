var renderer = PIXI.autoDetectRenderer(800, 600, null, true, true);

var rendererElement = document.getElementById('renderer');
var consoleElement = document.getElementById('console');

function log(str)
{
    consoleElement.innerHTML+= str + '\n';
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

rendererElement.appendChild(renderer.view);

var stage = new PIXI.Stage(0x000000, true);

var graphics = new PIXI.Graphics();

graphics.setInteractive(true);

graphics.beginFill(0x0000FF);

// set the line style to have a width of 5 and set the color to red
graphics.lineStyle(1, 0xFF0000);

// draw a rectangle
graphics.drawRect(15, 15, 300, 200);
graphics.hitArea = new PIXI.Rectangle(15, 15, 300, 200);

graphics.mousedown = graphics.touchstart = function(data) {
    //data.originalEvent.stopPropagation();
    log("graphics mousedown/touchstart");
};

var graphics1 = new PIXI.Graphics();

graphics1.setInteractive(true);

graphics1.beginFill(0x00FF00);

// set the line style to have a width of 5 and set the color to red
graphics1.lineStyle(1, 0xFF0000);

// draw a rectangle
graphics1.drawRect(30, 30, 300, 200);
graphics1.hitArea = new PIXI.Rectangle(30, 30, 300, 200);



graphics1.mousedown = graphics1.touchstart = function(data) {
    //data.originalEvent.stopPropagation();
    log("graphics1 mousedown/touchstart");
};



stage.addChild(graphics1);

graphics1.addChild(graphics);

stage.mousedown = function (data) {
    //data.originalEvent.stopPropagation();
    log("stage down");
};

requestAnimFrame( animate );

function animate() {

    requestAnimFrame( animate );

    // render the stage
    renderer.render(stage);
}
