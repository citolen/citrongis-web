var renderer = new PIXI.CanvasRenderer(800, 600, null, true);

var rendererElement = document.getElementById('renderer');
var consoleElement = document.getElementById('console');

function log(str)
{
    consoleElement.innerHTML+= str + '\n';
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

rendererElement.appendChild(renderer.view);

var stage = new PIXI.Stage(0x000000, true);

console.time("toto");
var i = 0;
while (i < 25) {
    var o = {x: Math.random() * 800, y: Math.random() * 600};
    o.edgeW = o.x + Math.random() * 20;
    o.edgeH = o.y + Math.random() * 20;
    var rect = new PIXI.Graphics();

    rect.setInteractive(true);

    rect.beginFill(0x0000FF);

    // draw a rectangle
    rect.drawRect(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
    rect.hitArea = new PIXI.Rectangle(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
    stage.addChild(rect);
    stage.quadTree.insert({toto:null}, o);
    ++i;
}
console.timeEnd("toto");

var graphics = new PIXI.Graphics();

graphics.setInteractive(true);

graphics.beginFill(0x0000FF);

// set the line style to have a width of 5 and set the color to red
graphics.lineStyle(1, 0xFF0000);

// draw a rectangle
graphics.drawRect(15, 15, 300, 200);
graphics.hitArea = new PIXI.Rectangle(15, 15, 300, 200);

graphics.mousedown = function(event) { console.log("down"); event.continue = false; };
graphics.mouseup = function(event) { console.log("up"); event.continue = false; };
graphics.click = function () { console.log("click");};

/*graphics.mouseover = function () { console.log("graphics over");};
graphics.mouseout = function () { console.log("graphics out");};

graphics.mousedown = graphics.touchstart = function(data) {
    //data.originalEvent.stopPropagation();
    log("graphics mousedown/touchstart");
};*/

var graphics1 = new PIXI.Graphics();

graphics1.setInteractive(true);

graphics1.beginFill(0x00FF00);

// set the line style to have a width of 5 and set the color to red
graphics1.lineStyle(1, 0xFF0000);

// draw a rectangle
graphics1.drawRect(30, 30, 300, 200);
graphics1.hitArea = new PIXI.Rectangle(30, 30, 300, 200);

graphics1.mousedown = function() { console.log("down1");};
graphics1.mouseup = function() { console.log("up1");};
graphics1.click = function() { console.log("click1");};

//graphics1.mouseover = function () { console.log("graphics1 over");};
//graphics1.mouseout = function () { console.log("graphics1 out");};

/*graphics1.mousedown = graphics1.touchstart = function(data) {
    //data.originalEvent.stopPropagation();
    log("graphics1 mousedown/touchstart");
};*/

var container = new PIXI.DisplayObjectContainer();

container.addChild(graphics1);

container.addChild(graphics);

container.setInteractive(true);

stage.addChild(container);

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
