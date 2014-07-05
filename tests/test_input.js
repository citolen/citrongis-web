var renderer = new PIXI.CanvasRenderer(800, 600, null, true);

var quadTest = new PIXI.Quadtree(0, 0, 800, 600, 4);
/*quadTest.nodes = [
    new PIXI.Quadtree(0, 0, 400, 300), new PIXI.Quadtree(400, 0, 800, 300),
    new PIXI.Quadtree(0, 300, 400, 600), new PIXI.Quadtree(400, 300, 800, 600)
                    ];*/



var rendererElement = document.getElementById('renderer');
var consoleElement = document.getElementById('console');

function log(str)
{
    consoleElement.innerHTML+= str + '\n';
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

rendererElement.appendChild(renderer.view);

var stage = new PIXI.Stage(0x000000, true);
stage.setQuadtreeSize(renderer.width, renderer.height);

/*var o = {x: 10, y: 10, edgeW: 10 + 20, edgeH: 10 + 20};
var rect = new PIXI.Graphics();
rect.setInteractive(true);
rect.beginFill(255);
rect.lineStyle(1, 0x000000);
rect.drawRect(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
rect.hitArea = new PIXI.Rectangle(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
stage.addChild(rect);
quadTest.insert(rect, o);

o = {x: 50, y: 50, edgeW: 50 + 20, edgeH: 50 + 20};
rect = new PIXI.Graphics();
rect.setInteractive(true);
rect.beginFill(0x0000FF);
rect.lineStyle(1, 0x000000);
rect.drawRect(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
rect.hitArea = new PIXI.Rectangle(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
stage.addChild(rect);
quadTest.insert(rect, o);

o = {x: 450, y: 150, edgeW: 450 + 20, edgeH: 150 + 20};
rect = new PIXI.Graphics();
rect.setInteractive(true);
rect.beginFill(0x0000FF);
rect.lineStyle(1, 0x000000);
rect.hitArea = new PIXI.Rectangle(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
stage.addChild(rect);
quadTest.insert(rect, o);
rect.drawRect(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);*/


console.time("toto");
/*var i = 0;
while (i < 10000) {
    var o = {x: Math.random() * 800, y: Math.random() * 600};
    o.edgeW = o.x + 2;
    o.edgeH = o.y + 2;
    var rect = new PIXI.Graphics();

    rect.setInteractive(true);
    rect.hitArea = new PIXI.Rectangle(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
    stage.addChild(rect);
    quadTest.insert(rect, o);
    rect.drawRect(o.x, o.y, o.edgeW - o.x, o.edgeH - o.y);
    ++i;
}*/
console.timeEnd("toto");

var graphics = new PIXI.Graphics();
graphics.setInteractive(true);
graphics.beginFill(0x0000FF);
graphics.lineStyle(1, 0xFF0000);
graphics.drawRect(15, 15, 300, 200);
graphics.hitArea = new PIXI.Rectangle(15, 15, 300, 200);
graphics.mousedown = function(event) { console.log("down"); event.continue = false; };
graphics.mouseup = function(event) { console.log("up"); event.continue = false; };
graphics.click = function () { console.log("click");};
graphics.mouseover = function (event) { console.log("over bleu"); event.continue = false; };
graphics.mouseout = function (event) { console.log("out bleu"); event.continue = false; };

var graphics1 = new PIXI.Graphics();
graphics1.setInteractive(true);
graphics1.beginFill(0x00FF00);
graphics1.lineStyle(1, 0xFF0000);
graphics1.drawRect(30, 30, 300, 200);
graphics1.hitArea = new PIXI.Rectangle(30, 30, 300, 200);
graphics1.mousedown = function() { console.log("down1");};
graphics1.mouseup = function() { console.log("up1");};
graphics1.click = function() { console.log("click1");};
graphics1.mouseover = function (event) { console.log("over vert"); event.continue = false; };
graphics1.mouseout = function (event) { console.log("out vert"); event.continue = false; };

var container = new PIXI.DisplayObjectContainer();
container.addChild(graphics1);
container.addChild(graphics);
container.setInteractive(true);

// ----------------------

graphics = new PIXI.Graphics();
graphics.setInteractive(true);
graphics.beginFill(0xFF0000);
graphics.lineStyle(1, 0x00FF00);
graphics.drawRect(30, 30, 30, 30);
graphics.hitArea = new PIXI.Rectangle(30, 30, 30, 30);
graphics.mousedown = function(event) { console.log("down2"); event.continue = false; };
graphics.mouseup = function(event) { console.log("up2"); event.continue = false; };
graphics.click = function () { console.log("click2");};

graphics1 = new PIXI.Graphics();
graphics1.setInteractive(true);
graphics1.beginFill(0x00FF00);
graphics1.lineStyle(1, 0xFF0000);
graphics1.drawRect(35, 35, 30, 30);
graphics1.hitArea = new PIXI.Rectangle(35, 35, 30, 30);
graphics1.mousedown = function() { console.log("down3");};
graphics1.mouseup = function() { console.log("up3");};
graphics1.click = function() { console.log("click3");};

var container2 = new PIXI.DisplayObjectContainer();
container2.addChild(graphics1);
container2.addChild(graphics);
container2.setInteractive(true);

stage.addChild(container);
stage.addChild(container2);

stage.mousedown = function (data) {
    //data.originalEvent.stopPropagation();
    log("stage down");
};

requestAnimFrame( animate );

function animate() {
 requestAnimFrame( animate );


    // render the stage
    renderer.render(stage);
    //quadTest.debug(renderer.context);

}
