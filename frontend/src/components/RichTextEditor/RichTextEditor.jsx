import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const RichTextEditor = ({ value, onChange }) => {
  const [editorData, setEditorData] = useState(value || "");

  return (
    <div style={{ marginTop: "12px" }}>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          if (onChange) onChange(data);
        }}
      />
    </div>
  );
};

export default RichTextEditor;