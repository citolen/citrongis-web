this.onLoaded = function () {

    redraw_groups();

    C.Helpers.layermanager.on('groupCreated', redraw_groups);
    C.Helpers.layermanager.on('groupMoved', redraw_groups);
    C.Helpers.layermanager.on('groupDeleted', redraw_groups);
    C.Helpers.layermanager.on('groupChange', redraw_groups);
    C.Helpers.layermanager.on('layerChange', redraw_groups);
};

function redraw_groups() {

    var groups = C.Helpers.layermanager._groups();
    var holder = $('.groups', '.layer-manager-ui');

    holder.empty();

    groups = groups.sort(function (a, b) {
        if (a.idx > b.idx) return -1;
        if (a.idx < b.idx) return 1;
        return 0;
    });

    for (var i = 0; i < groups.length; ++i) {

        var group = groups[i];

        var groupHtml = create_group(group.group);

        holder.append(groupHtml);
    }
}

function create_group(group) {

    var baseHtml = $.parseHTML('\
<div class="group">\
    <div class="header">\
        <span class="action">\
            <i class="fa fa-minus-square-o"></i>\
        </span>\
        <span class="action">\
            <i class="fa fa-square-o"></i>\
        </span>\
        <span class="name">\
        </span>\
    </div>\
    <div class="layers">\
    </div>\
<\div>\
');

    $('.header .name', baseHtml).html(group._name);

    var layers = group.layers();
    var holder = $('.layers', baseHtml);

    layers = layers.sort(function (a, b) {
        if (a.idx > b.idx) return -1;
        if (a.idx < b.idx) return 1;
        return 0;
    });

    for (var i = 0; i < layers.length; ++i) {
        var layer = layers[i];

        var layerHtml = create_layer(layer.layer);

        holder.append(layerHtml);

    }
    return baseHtml;
}

function create_layer(layer) {

    var baseHtml = $.parseHTML('\
<div class="layer">\
    <div class="header">\
        <span class="action">\
            <i class="fa fa-square-o"></i>\
        </span>\
        <span class="name"></span>\
    </div>\
</div>');

    $('.header .name', baseHtml).html(layer._name || 'no_name');

    return baseHtml;
}
