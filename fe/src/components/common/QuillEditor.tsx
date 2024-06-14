import React, { useCallback, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { functionChange } from '../../type';
import 'react-quill/dist/quill.snow.css';
import { httpClient } from '../../helpers/api';
import ImageResize from 'quill-image-resize-module-react';
import { ResizableBox } from 'react-resizable';

var undo = `<img width="17" height="12" src="/assets/img/icon/heading-h1.svg"/>`;

var redo = `<img width="17px" height="12px" src="/assets/img/icon/heading-h2.svg"/>`;

var icons = Quill.import('ui/icons'); icons.undo = undo;
var icons = Quill.import('ui/icons'); icons.redo = redo;
// var icons = Quill.import('ui/icons'); icons.header[3] = icon_h3;
// var icons = Quill.import('ui/icons'); icons.header[4] = icon_h4;

Quill.register('modules/imageResize', ImageResize);

interface editorCkProps {
  onDataChange: functionChange;
  data: string;
  size?: { with?: number | undefined, height: number };
  name?: string;
}

const QuillEditor: React.FC<editorCkProps> = (props: editorCkProps) => {
  const [value, setValue] = useState<string>(props.data);

  const onChangeValue = (text: string) => {
    setValue(text);
    props.onDataChange(text);
  }
  const reactQuillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("image", file);
        const res = (await (await httpClient("multipart/form-data")).post("/articles/cke-upload", formData));
        if (!res) return;
        const url = `${process.env.REACT_APP_URL_MINIO}${res.data.url}`;
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  return (
    <ResizableBox
      height={props.size && props.size.height ? props.size.height + 50 : 600}
      width={props.size && props.size.with ? props.size.with : Infinity}
    >
      <ReactQuill
        theme="snow"
        value={props.data}
        onChange={onChangeValue}
        ref={reactQuillRef}
        placeholder="Nội dung..."
        style={{ height: props.size && props.size.height ? props.size.height + "px" : "550px" }}
        modules={{
          toolbar: {
            container: [
              [{ header: [0, 1, 2, 3, 4, 5, 6] }, { font: [] }, { color: [] }, { background: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],

              ["link", "image"],
              ["code-block"],
              [{ align: [] }],
              ["clean"],
            ],
            handlers: {
              image: imageHandler
            },
          },
          clipboard: {
            matchVisual: false,
          },
          imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
          },
        }}
      />
    </ResizableBox>

  )
}

export default QuillEditor