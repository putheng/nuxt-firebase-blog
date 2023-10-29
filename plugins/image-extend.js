import { firestore, storage, auth } from '../plugins/firebase'

export const QuillWatch = {
    watcher: {},
    active: null,
    on: function (imageExtendId, ImageExtend) {
        if (!this.watcher[imageExtendId]) {
            this.watcher[imageExtendId] = ImageExtend
        }
    },
    emit: function (activeId, type = 1) {
        this.active = this.watcher[activeId]
        if (type === 1) {
            imgHandler()
        }
    }
}

export class ImageExtend {
    constructor(quill, config = {}) {
        this.id = Math.random()
        this.quill = quill
        this.quill.id = this.id
        this.config = config
        this.file = ''
        this.imgURL = ''
        quill.root.addEventListener('paste', this.pasteHandle.bind(this), false)
        quill.root.addEventListener('drop', this.dropHandle.bind(this), false)
        quill.root.addEventListener('dropover', function (e) {
            e.preventDefault()
        }, false)
        this.cursorIndex = 0
        QuillWatch.on(this.id, this)
    }

    pasteHandle(e) {
        // e.preventDefault()
        QuillWatch.emit(this.quill.id, 0)
        let clipboardData = e.clipboardData
        let i = 0
        let items, item, types

        if (clipboardData) {
            items = clipboardData.items;

            if (!items) {
                return;
            }
            item = items[0];
            types = clipboardData.types || [];

            for (; i < types.length; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
                }
            }
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                this.file = item.getAsFile()
                let self = this
                // 如果图片限制大小
                if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
                    if (self.config.sizeError) {
                        self.config.sizeError()
                    }
                    return
                }
                // if (this.config.action) {
                //     this.uploadImg()
                // } else {
                //     this.toBase64()
                // }
                this.uploadImg()
            }
        }
    }

    dropHandle(e) {
        QuillWatch.emit(this.quill.id, 0)
        const self = this
        e.preventDefault()
        if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
            if (self.config.sizeError) {
                self.config.sizeError()
            }
            return
        }
        self.file = e.dataTransfer.files[0];
        self.uploadImg()
    }

    toBase64() {
        const self = this
        const reader = new FileReader()
        reader.onload = (e) => {
            // 返回base64
            self.imgURL = e.target.result
            self.insertImg()
        }
        reader.readAsDataURL(self.file)
    }

    async uploadImg(){
        const storageRef = storage.ref();
        const self = this
        try {
            QuillWatch.active.uploading()
            const postImageRef = await storageRef.child(`user-data/1234/posts/1234.jpg`).put(self.file);
            self.imgURL = (await postImageRef.ref.getDownloadURL());

            QuillWatch.active.uploadSuccess()
            self.insertImg()
        } catch (error) {
            QuillWatch.active.uploadError()
        }
    }

    insertImg() {
        const self = QuillWatch.active
        self.quill.insertEmbed(QuillWatch.active.cursorIndex, 'image', self.imgURL)
        self.quill.update()
        self.quill.setSelection(self.cursorIndex+1);
    }

    progress(pro) {
        pro = '[' + 'uploading' + pro + ']'
        QuillWatch.active.quill.root.innerHTML
            = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, pro)
    }

    uploading() {
        let length = (QuillWatch.active.quill.getSelection() || {}).index || QuillWatch.active.quill.getLength()
        QuillWatch.active.cursorIndex = length
        QuillWatch.active.quill.insertText(QuillWatch.active.cursorIndex, '[uploading...]', {'color': 'red'}, true)
    }

    uploadError() {
        QuillWatch.active.quill.root.innerHTML
            = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, '[upload error]')
    }

    uploadSuccess() {
        QuillWatch.active.quill.root.innerHTML
            = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, '')
    }
}

export function imgHandler() {
    let fileInput = document.querySelector('.quill-image-input');
    if (fileInput === null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.classList.add('quill-image-input');
        fileInput.style.display = 'none'

        fileInput.addEventListener('change', function () {
            let self = QuillWatch.active
            self.file = fileInput.files[0]
            fileInput.value = ''
            if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
                if (self.config.sizeError) {
                    self.config.sizeError()
                }
                return
            }
            // if (self.config.action) {
            //     self.uploadImg()
            // } else {
            //     self.toBase64()
            // }
            self.uploadImg()
        })
        document.body.appendChild(fileInput);
    }
    fileInput.click();
}