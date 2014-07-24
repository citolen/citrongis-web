Extension ZIP compression

    /
        /ui           -  optional
            /js
            /css
            /view
        /src            -  optional
        package.json    - *required*
        strings.json    -  optional


package.json:
```
{
    "name": "unique application name", - *required*
    "version": "0.123", - *required*
    "main": "src/main.js", - optional; default: src/main.js
    "dependencies": optional
    [
        {
            "name": "dependency name",          - *required*
            "version": "dependency version"     - optional
        },
        ...
    ]
}
```

strings.json:
```
{
    "fr":
    {
        "APPLICATION_NAME": "citrongis",
        "PROPERTY": "value"
    }
    "default":
    {
        "PROPERTY": "value"
    }
}
```

code:

    strings["property"] will return according to system localization
    
    
    
    
    
Extension Context

```
this = context; /* context of the extension */

this.interface = [
    {
        name: 'my_interface_name',
        view: viewobject
    },...
]

this.document = DOM element containing the current interface

this.strings = localization object containing strings.json content


viewobject = {
    bind(data);
}

view template (EJS syntax):

<extension_body>
<%= CitronGIS.UI.script(context, 'myscript.js'); %>

<span id="<%= CitronGIS.UI.id(context, 'my_id'); %>" class="<%= CitronGIS.UI.class(context, 'my_class', 'my_class2'); %>">
    <%= myvariable %>
<span>
<button click="<%= CitrongGIS.UI.function(context, my_func || context.my_func || 'function () {}'); %>">Click me</button>

</extension_body>


CitronGIS.UI.script =>

(function() {
    content of myscript.js
}).bind(extension_context)();

CitronGIS.UI.id =>

id -> context.name + "_" + id  => id="appname_my_id"

CitronGIS.UI.class =>

[class] -> [context.name + "_" + class] class="appname_my_class appname_my_class2"

CitronGIS.UI.function =>

var func = my_func is function || eval(my_func);
CitronGIS.UI.__invoke(context.name, CitronGIS.UI.__register(func));


```