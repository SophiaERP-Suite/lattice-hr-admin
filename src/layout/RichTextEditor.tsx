import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
 
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}
 
export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[150px] rounded-md border border-gray-300 bg-white p-4 text-sm focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
 
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);
 
  if (!editor) return null;
 
  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-sm border ${
      active ? 'bg-gray-200 font-semibold' : 'bg-white'
    } hover:bg-gray-100`;
 
  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 rounded-md border border-gray-300 bg-gray-100 p-2">
        <button
          type="button"
          className={btn(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
 
        <button
          type="button"
          className={btn(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
 
        <button
          type="button"
          className={btn(editor.isActive('underline'))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
 
        <button
          type="button"
          className={btn(editor.isActive('heading', { level: 1 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
 
        <button
          type="button"
          className={btn(editor.isActive('heading', { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
 
        <button
          type="button"
          className={btn(editor.isActive('heading', { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
 
        <button
          type="button"
          className={btn(false)}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↺
        </button>
 
        <button
          type="button"
          className={btn(false)}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↻
        </button>
 
        <button
          type="button"
          className={btn(editor.isActive('blockquote'))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </button>
      </div>
 
      <EditorContent editor={editor} />
    </div>
  );
}