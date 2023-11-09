import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import Quill from 'quill'

import { ImageExtend, QuillWatch } from './image-extend';

import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/atom-one-dark.css'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css'

import 'quill/dist/quill.bubble.css' // for bubble theme
import 'quill/dist/quill.core.css' // import styles

const icons = Quill.import('ui/icons');
icons['code-block'] = '<svg viewbox="0 -2 15 18">\n' + '\t<polyline class="ql-even ql-stroke" points="2.48 2.48 1 3.96 2.48 5.45"/>\n' + '\t<polyline class="ql-even ql-stroke" points="8.41 2.48 9.9 3.96 8.41 5.45"/>\n' + '\t<line class="ql-stroke" x1="6.19" y1="1" x2="4.71" y2="6.93"/>\n' + '\t<polyline class="ql-stroke" points="12.84 3 14 3 14 13 2 13 2 8.43"/>\n' + '</svg>';

Quill.register('modules/ImageExtend', ImageExtend);

Vue.use(VueQuillEditor, {
  theme: 'bubble',
  placeholder: 'Select your text and see the magic.',
  modules: {
    syntax: { highlight: text => hljs.highlightAuto(text).value },
    toolbar: {
      container: [
        [{ 'header': [2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', /*'video',*/ 'code-block'],
        ['clean']
      ],
      handlers: {
        'image': function (state) {
          QuillWatch.emit(this.quill.id)
        }
      }
    },
    ImageExtend: {
      vue: this
    }
  }
})