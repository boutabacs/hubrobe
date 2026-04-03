import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { CharacterCount } from '@tiptap/extension-character-count';
import { FontFamily } from '@tiptap/extension-font-family';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, 
  List, ListOrdered, Quote, Minus, Undo, Redo, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Link as LinkIcon, Link2Off,
  Image as ImageIcon, Video as YoutubeIcon, 
  Table as TableIcon, Heading1, Heading2, Heading3,
  Code2, Trash2, Plus, Type, CheckSquare, Subscript as SubIcon, Superscript as SuperIcon,
  Eraser, Maximize, Minimize, ExternalLink, Outdent, Indent, RemoveFormatting, Palette
} from 'lucide-react';

const lowlight = createLowlight(common);

const MenuButton = ({ onClick, isActive, disabled, children, title, activeClass = 'bg-black text-white' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-all flex items-center justify-center ${
      isActive 
        ? activeClass 
        : 'hover:bg-gray-100 text-gray-600 hover:text-black'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-gray-200 mx-2" />;

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use lowlight instead
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md my-6 mx-auto block',
        },
      }),
      Youtube.configure({
        width: 840,
        height: 480,
        HTMLAttributes: {
          class: 'aspect-video w-full rounded-lg shadow-md my-8',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: 'Write your masterpiece here...',
      }),
      CharacterCount,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-10 min-h-[500px] max-w-none prose-headings:font-gt-walsheim prose-p:font-sofia-pro prose-img:rounded-xl',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt('YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white shadow-sm ring-1 ring-black/5">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 border-b border-gray-100 bg-white sticky top-0 z-20">
        {/* History Group */}
        <div className="flex items-center bg-gray-50 rounded-lg p-0.5">
          <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
            <Undo size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
            <Redo size={16} />
          </MenuButton>
        </div>

        <ToolbarDivider />

        {/* Text Style Group */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            isActive={editor.isActive('heading', { level: 1 })}
            title="H1"
          >
            <Heading1 size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })}
            title="H2"
          >
            <Heading2 size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            isActive={editor.isActive('heading', { level: 3 })}
            title="H3"
          >
            <Heading3 size={16} />
          </MenuButton>
        </div>

        <ToolbarDivider />

        {/* Formatting Group */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleCode().run()} 
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code size={16} />
          </MenuButton>
        </div>

        <ToolbarDivider />

        {/* Alignment Group */}
        <div className="flex items-center gap-0.5">
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Left">
            <AlignLeft size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Center">
            <AlignCenter size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Right">
            <AlignRight size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
            <AlignJustify size={16} />
          </MenuButton>
        </div>

        <ToolbarDivider />

        {/* List Group */}
        <div className="flex items-center gap-0.5">
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
            <ListOrdered size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List">
            <CheckSquare size={16} />
          </MenuButton>
          <ToolbarDivider />
          <MenuButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Indent">
            <Indent size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Outdent">
            <Outdent size={16} />
          </MenuButton>
        </div>

        <ToolbarDivider />

        {/* Color & Font Group */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <div className="flex items-center gap-1" title="Text Color">
              <Palette size={14} className="text-gray-400" />
              <input
                type="color"
                onInput={e => editor.chain().focus().setColor(e.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-5 h-5 p-0 cursor-pointer border-none bg-transparent"
              />
            </div>
            <ToolbarDivider />
            <div className="flex items-center gap-1" title="Highlight Color">
              <Highlighter size={14} className="text-gray-400" />
              <input
                type="color"
                onInput={e => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
                value={editor.getAttributes('highlight').color || '#ffff00'}
                className="w-5 h-5 p-0 cursor-pointer border-none bg-transparent"
              />
              <button 
                type="button"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('highlight') ? 'text-black' : 'text-gray-300'}`}
                title="Remove Highlight"
              >
                <Eraser size={12} />
              </button>
            </div>
          </div>
          <select 
            className="text-[12px] bg-gray-50 border border-gray-100 rounded-md px-2 py-1 outline-none font-sofia-pro cursor-pointer hover:bg-gray-100 transition-colors"
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontFamily || ''}
          >
            <option value="">Default Font</option>
            <option value="Sofia Pro">Sofia Pro</option>
            <option value="GT Walsheim">GT Walsheim</option>
            <option value="monospace">Monospace</option>
            <option value="serif">Serif</option>
          </select>
        </div>

        <ToolbarDivider />

        {/* Media & Links Group */}
        <div className="flex items-center gap-0.5">
          <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
            <LinkIcon size={16} />
          </MenuButton>
          <MenuButton onClick={addImage} title="Add Image">
            <ImageIcon size={16} />
          </MenuButton>
          <MenuButton onClick={addYoutubeVideo} title="YouTube">
            <YoutubeIcon size={16} />
          </MenuButton>
        </div>

        <ToolbarDivider />

        {/* Structure Group */}
        <div className="flex items-center gap-0.5">
          <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
            <Quote size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
            <Code2 size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
            <Minus size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Table">
            <TableIcon size={16} />
          </MenuButton>
        </div>

        {/* Utilities */}
        <div className="ml-auto flex items-center gap-0.5">
          <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
            <Eraser size={16} />
          </MenuButton>
        </div>
      </div>

      {/* Table Actions (Floating) */}
      {editor.isActive('table') && (
        <div className="bg-[#1a1a1a] text-white px-4 py-2 flex items-center gap-4 text-[11px] font-sofia-pro uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 pr-4 border-r border-white/20">
            <TableIcon size={14} className="text-gray-400" />
            <span className="font-bold text-gray-400">Table Settings</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="hover:text-blue-400 transition-colors">Add Column</button>
            <button onClick={() => editor.chain().focus().addRowBefore().run()} className="hover:text-blue-400 transition-colors">Add Row</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()} className="hover:text-red-400 transition-colors">Del Column</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()} className="hover:text-red-400 transition-colors">Del Row</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className="text-red-500 hover:text-red-400 font-bold ml-2">Delete Table</button>
          </div>
        </div>
      )}

      {/* EDITOR CONTENT */}
      <div className="flex-1 overflow-y-auto bg-white min-h-[500px] scrollbar-thin scrollbar-thumb-gray-200">
        <EditorContent editor={editor} />
      </div>

      {/* FOOTER STATS */}
      <div className="px-6 py-2.5 border-t border-gray-100 bg-gray-50/80 flex justify-between items-center backdrop-blur-sm">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-sofia-pro uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {editor.storage.characterCount?.characters?.() || 0} characters
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-sofia-pro uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {editor.storage.characterCount?.words?.() || 0} words
          </div>
        </div>
        <div className="text-[10px] text-gray-300 font-sofia-pro uppercase tracking-widest flex items-center gap-1">
          <ExternalLink size={10} /> Rich Text Editor Active
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
