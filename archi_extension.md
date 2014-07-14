Extension ZIP compression

    /
        /html           -  optional
            /js
            /css
            /view
            /resources
        /src            -  optional
        /resources      -  optional
        package.json    - *requiered*
        strings.json    -  optional


package.json:

{
    "uid": "unique application id", - *requiered*
    "version": "0.123", - *requiered*
    "main": "/src/main.js", - optional; default: /src/main.js
    "dependencies": optional
    {
        {
            "uid": "dependency uid",            - *requiered*
            "version": "dependency version"     - *requiered* could be 'latest'
        },
        ...
    }
}

strings.json:
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

code:

    strings["property"] will return according to system localization