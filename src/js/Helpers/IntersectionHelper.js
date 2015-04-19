var C = C || {};
C.Helpers = C.Helpers || {};

C.Helpers.IntersectionHelper = {};

C.Helpers.IntersectionHelper.lineIntersection = function (p1, p2, p3, p4) {

    'use strict';

    var a = [p2[0] - p1[0], p2[1] - p1[1]];
    var b = [p3[0] - p4[0], p3[1] - p4[1]];
    var c = [p1[0] - p3[0], p1[1] - p3[1]];

    var alphaNumerator = b[1] * c[0] - b[0] * c[1];
    var alphaDenominator = a[1] * b[0] - a[0] * b[1];
    var betaNumerator = a[0] * c[1] - a[1] * c[0];
    var betaDenominator = alphaDenominator;
    if (alphaDenominator == 0 || betaDenominator == 0)
        return (false);
    if (alphaDenominator > 0)
    {
        if (alphaNumerator < 0 || alphaNumerator > alphaDenominator)
            return (false);
    }
    else if (alphaNumerator > 0 || alphaNumerator < alphaDenominator)
    {
        return (false);
    }
    if (betaDenominator > 0)
    {
        if (betaNumerator < 0 || betaNumerator > betaDenominator)
            return (false);
    }
    else if (betaNumerator > 0 || betaNumerator < betaDenominator)
    {
        return (false);
    }
    return (true);
};

C.Helpers.IntersectionHelper.xProduct = function (a, b) {

    'use strict';

    return (a[0] * b[1] - a[1] * b[0]);
};

C.Helpers.IntersectionHelper.getSide = function (a, b) {

    'use strict';

    var x = C.Helpers.IntersectionHelper.xProduct(a, b);
    if (x < 0)
        return (-1);
    if (x > 0)
        return (1);
    return (0);
};

/*C.Helpers.IntersectionHelper.polygonContainsPoint = function (polygon, point) {

    'use strict';

    var previousSide = 0;
    var i = 0;
    var n = polygon.length - 1;
    for (var j = 0, k = polygon.length; j < k; ++j) {
        var a = polygon[j];
        var b = i == n ? polygon[0] : polygon[i + 1];
        var affineSegment = [b[0] - a[0], b[1] - a[1]];
        var affinePoint = [point[0] - a[0], point[1] - a[1]];

        var currentSide = C.Helpers.IntersectionHelper.getSide(affineSegment, affinePoint);

        if (currentSide == 0)
            return (false);
        if (previousSide == 0)
            previousSide = currentSide;
        if (previousSide != currentSide)
            return (false);
        ++i;
    }
    return (true);
};*/

C.Helpers.IntersectionHelper.polygonContainsPoint = function (vs, point) {

    'use strict';

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

C.Helpers.IntersectionHelper.polygonContainsPolygon = function (p1, p2) {

    'use strict';

    if (C.Helpers.IntersectionHelper.polygonContainsPoint(p2, p1[0]))
        return (true);
    var i = 0;
    var n = p1.length - 1;
    var m = p2.length - 1;
    for (var k = 0; k < p1.length; ++k) {
        var a = p1[k];
        var b = (i == n) ? (p1[0]) : (p1[i + 1]);
        var j = 0;
        for (var l = 0; l < p2.length; ++l) {
            var c = p2[l];
            var d = (j == m) ? (p2[0]) : (p2[j + 1]);
            if (C.Helpers.IntersectionHelper.lineIntersection(a, b, c, d))
                return (true);
            ++j;
        }
        ++i;
    }
    return C.Helpers.IntersectionHelper.polygonContainsPoint(p1, p2[0]);
};
