var map = new C.CitrongGIS(document.getElementById('citrongis'));

var fileInput = document.getElementById('file');

function fileChanged() {
    map.loadExtension(this.files[0], map);
};

fileInput.onchange = fileChanged;
