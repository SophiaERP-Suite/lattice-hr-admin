import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';
import { PenLine } from 'lucide-react';
 
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rounded?: boolean;
  width85?: boolean;
  showToolbarToggle?: boolean;
  toolbarVisible?: Boolean;
  minHeight?: string;
  maxHeight?: string;
}
 
export default function RichTextEditor({
  value,
  onChange,
  rounded = false,
  width85 = false,
  showToolbarToggle = false,
  toolbarVisible = true,
  minHeight = '150px',
  maxHeight = '50px'
}: RichTextEditorProps) {
  const [showToolBar, setShowToolBar] = useState(toolbarVisible);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        underline: false,
      }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          ` form-control ${rounded ? 'rounded-pill px-3 py-2' : 'rounded'} ${width85 ? 'w-85' : 'w-100'} text-black`,
        style: `${!width85 ? `min-height: ${minHeight};` : `max-height:${maxHeight}; overflow:auto;`}`
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
    `btn btn-sm ${active ? 'btn-secondary' : 'btn-outline-secondary'} me-1 mb-1`;
 
  return (
    <div className={`d-flex flex-column`} style={{ width: '100%' }}>
 
      {/* Toggle Toolbar Button */}
      
 
      {/* Toolbar */}
      <div className="rounded bg-white">
        {showToolbarToggle && (
          <button
            type="button"
            onClick={() => setShowToolBar(!showToolBar)}
            className={`btn me-1 ${showToolBar ? 'btn-info-light' : 'text-black'}`}
          >
            <PenLine size={12} />
          </button>
        )}

        {
          showToolBar && (
              <button
              type="button"
              className={btn(editor.isActive('bold'))}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <b>B</b>
            </button>
          )
        }
        
        {
          showToolBar && (
            <button
              type="button"
              className={btn(editor.isActive('italic'))}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <i>I</i>
            </button>
          )
        }

        {
          showToolBar && (
            <button
              type="button"
              className={btn(editor.isActive('underline'))}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <u>U</u>
            </button>
          )
        }

        {
          showToolBar && (
            <button
            type="button"
            className={btn(editor.isActive('heading', { level: 1 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </button>
          )
        }

        {
          showToolBar && (
            <button
              type="button"
              className={btn(editor.isActive('heading', { level: 2 }))}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </button>
          )
        }

        {
          showToolBar && (
            <button
              type="button"
              className={btn(editor.isActive('heading', { level: 3 }))}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </button>
          )
        }
        {
          showToolBar && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={() => editor.chain().focus().undo().run()}
            >
              ↺
            </button>
          )
        }
        

        {
          showToolBar && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={() => editor.chain().focus().redo().run()}
            >
              ↻
            </button>
          )
        }
        

        {
          showToolBar && (
            <button
              type="button"
              className={btn(editor.isActive('blockquote'))}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              ❝
            </button>
          )
        }
        
      </div>
 
      <EditorContent editor={editor} />
    </div>
  );
}