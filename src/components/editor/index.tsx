"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState } from "lexical";

import { AutoFocusPlugin } from "@/components/editor/plugins/auto-focus";
import { OnChangePlugin } from "@/components/editor/plugins/on-change";

export function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => {
      console.log(error);
    },
  };

  const onChange = (editorState: EditorState) => {
    const editorStateJson = editorState.toJSON();
    console.log(JSON.stringify(editorStateJson));
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="px-2 py-1 border-2 border-blue-200" />}
        placeholder={<div className="absolute top-1 left-2 text-gray-500">プレースホルダー</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}
