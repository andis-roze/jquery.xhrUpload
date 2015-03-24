;(function($) {
    $.fn.xhrUpload = function(options) {
        var $container,
            fileInputTemplate = '<input type="file" name="file"{0} />',
            $fileInput, $addFile, $dropFile,
            settings = $.extend(true, $.fn.xhrUpload.defaults, options);

        function uploadFile (file) {
            var formData = new FormData(),
                xhr = new XMLHttpRequest(),
                fileItem;

            xhr.upload.onloadstart = function(e) {
                if (typeof settings.onStart === 'function') {
                    fileItem = settings.onStart.call(this, e);
                }
            };

            xhr.upload.onprogress = function(e) {
                if (typeof settings.onProgress === 'function') {
                    settings.onProgress.call(this, e, fileItem);
                }
            };

            xhr.onreadystatechange = function(e) {
                if (xhr.readyState === 4 & typeof settings.onFinish === 'function') {
                    settings.onFinish.call(this, e, xhr.response, fileItem);
                }
            }

            if (settings.uploadUrl) {
                formData.append('file', file);
                xhr.open('post', settings.uploadUrl, true);
                xhr.send(formData);
            }
        }

        function traverseFiles (files) {
            if (typeof files !== 'undefined') {
                for (var i = 0; i < files.length; i++) {
                    uploadFile(files[i]);
                }
            }
        }

        if (settings.multiple) {
            $fileInput = $(fileInputTemplate.format(' multiple')).css({
                opacity: 0, 
                position: 'absolute',
                top: -1000
            });
        } else {
            $fileInput = $(fileInputTemplate.format('')).css({
                opacity: 0, 
                position: 'absolute',
                top: -1000
            });
        }

        this.append($fileInput);

        $addFile = $(settings.addFileSelector);
        $dropFile = $(settings.dropAreaSelector);

        $addFile.on('click', function() {
            $fileInput.click();
        });

        $fileInput.on('change', function() {
            traverseFiles(this.files);
        });

        $dropFile.on('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof settings.onDragEnter === 'function') {
                settings.onDragEnter.call(this, e);
            }
        });

        $dropFile.on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof settings.onDragLeave === 'function') {
                settings.onDragLeave.call(this, e);
            }
        });

        $dropFile.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $dropFile.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof settings.onDrop === 'function') {
                settings.onDrop.call(this, e);
            }
            
            traverseFiles(e.originalEvent.dataTransfer.files);
        });

        return this;
    };

    $.fn.xhrUpload.defaults = {
        uploadUrl: null,
        multiple: false,
        addFileSelector: '.add-file',
        dropAreaSelector: '.drop-file',
        onStart: null,
        onProgress: null,
        onFinish: null,
        onDragEnter: null,
        onDragLeave: null,
        onDrop: null
    };
})(jQuery);