var fileInput = document.getElementById('file');

fileInput.onchange = function () {
    var reader = new FileReader();

    reader.onload = function() {
        var extZip = new JSZip();
        extZip.load(reader.result);

        var e = new C.Extension.Extension(extZip);
        C.Extension.Manager.register(e);
        debugPackage(e.package);
        e.run();

        console.log(e.module.exports);
        e.module.exports.toto();

        e.module.ui.on('display', function (element) {
            document.body.appendChild(element);
        });

        e.module.ui.display('html/view/index.tmpl');
    };

    reader.readAsArrayBuffer(fileInput.files[0]);
};

function debugPackage(package) {
    console.log("name:" + package.name);
    console.log("version:" + package.version);
    console.log("main:" + package.main);
}
