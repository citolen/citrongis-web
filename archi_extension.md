Extension ZIP compression

    /
        /html           -  optional
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
    "main": "/src/main.js", - optional; default: /src/main.js
    "dependencies": optional
    {
        {
            "name": "dependency name",          - *required*
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