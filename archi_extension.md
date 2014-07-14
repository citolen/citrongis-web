Extension ZIP compression

    /
        /html           -  optional
            /js
            /css
            /view
        /src            -  optional
        package.json    - *requiered*
        strings.json    -  optional


package.json:
```
{
    "name": "unique application name", - *requiered*
    "version": "0.123", - *requiered*
    "main": "/src/main.js", - optional; default: /src/main.js
    "dependencies": optional
    {
        {
            "name": "dependency name",          - *requiered*
            "version": "dependency version"     - optional
        },
        ...
    }
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