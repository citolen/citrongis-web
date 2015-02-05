var self = this;

function changeColor (color) {
    var c = color.toRgb();
    c = (c.r * 256 * 256) + (c.g * 256) + c.b;
    self.southAmerica.fillColor(c);
}

function changeOutline (color) {
    var c = color.toRgb();
    c = (c.r * 256 * 256) + (c.g * 256) + c.b;
    self.southAmerica.outlineColor(c);
}

this.onLoaded = function () {
    $('#fill_color').spectrum({
        color: "#f00",
        change: changeColor,
        move: changeColor,
        clickoutFiresChange: true
    });
    $('#outline_color').spectrum({
        color: "#f00",
        change: changeOutline,
        move: changeOutline,
        clickoutFiresChange: true
    });
};
