import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";

type OnChangeProps = {
  onChange: (state: EditorState) => void;
};

export function OnChangePlugin({ onChange }: OnChangeProps) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    // editor.registerUpdateListener で、エディタへの変更が
    // 行われた時に実行されるコールバック関数を登録する。また
    // registerUpdateListner　はクリーンアップ関数を返すので
    // useEffect内のreturnに記述し、ちゃんとクリーンアップされるようにする
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}
