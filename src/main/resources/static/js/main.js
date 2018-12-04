'use strict';

document
    .getElementById('singleFileUploadInput')
    .addEventListener(
        'change',
        function () {
            var fr = new FileReader();
            fr.onload = function () {
                var res=this.result.toString().split('\n').length;
                var linenumbers = "";
                var i;
                for (i = 1; i < res+1; i++) {
                    linenumbers += i + "<br>";
                }
                document.getElementById('linenumbers').innerHTML = linenumbers;

                document.getElementById('contents').textContent = this.result;

            };
            fr.readAsText(this.files[0]);
        }
    );

var singleFileUploadInput = document.querySelector('#singleFileUploadInput');
var singleFileUploadError = document.querySelector('#singleFileUploadError');

function uploadSingleFile(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/uploadFile");
        var text = reader.result;
        formData.append("file", text);
        formData.append("name", file.name)
        xhr.onload = function () {
            console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if (xhr.status == 200) {
                singleFileUploadError.style.display = "none";
                document.getElementById('issues').textContent = ""; // Clear issues
                for (var key in response.errors) {
                    if (response.errors.hasOwnProperty(key)) {
                        document.getElementById('issues').textContent = document.getElementById('issues').textContent + "Line: " + key + "\n        " + response.errors[key] + "\n";
                    }
                }
                if(document.getElementById('issues').textContent === ""){
                    document.getElementById('issues').textContent = "No Errors Found"
                }
            } else {
                singleFileUploadError.innerHTML = (response && response.message) || "Some Error Occurred";
            }
        }

        xhr.send(formData);
    };
    reader.readAsText(file);
}

singleFileUploadInput.addEventListener('change', function (event) {
    var files = singleFileUploadInput.files;
    if (files.length === 0) {
        singleFileUploadError.innerHTML = "Please select a file";
        singleFileUploadError.style.display = "block";
    } else {
        singleFileUploadError.innerHTML = "";
        document.getElementById('filename').textContent = files[0].name;
        uploadSingleFile(files[0]);
    }
    event.preventDefault();
}, true);