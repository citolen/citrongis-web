function toto(content) {
    var extZip = new JSZip();
    extZip.load(content, { base64: true });

    var package = JSON.parse(extZip.file('package.json').asText());
    debugPackage(package);

    executeExtension(extZip, package);
}

function executeExtension(extZip, package) {
    var code = extZip.file(package.main).asText();
    var script = document.createElement('script');
    script.innerHTML = "(function(){" + code + "})();";
    document.body.appendChild(script);
}

function debugPackage(package) {
    console.log("name:" + package.name);
    console.log("version:" + package.version);
    console.log("main:" + package.main);
}

var file = document.createElement('script');
file.src = "http://localhost/citrongis/download.php?file=/citrongis/citrongis-app.zip&callback=toto";
document.body.appendChild(file);

