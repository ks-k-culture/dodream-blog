"use client";

import { useRef } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
  EditorBubble,
  EditorBubbleItem,
} from "novel";
import type { Editor } from "@tiptap/core";
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from "lucide-react";
import { suggestionItems, editorExtensions, editorStyles } from "@/lib/editor-config";

interface NovelEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export function NovelEditor({ initialContent, onChange }: NovelEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const hasSetInitialContent = useRef(false);

  return (
    <div className="relative min-h-[500px] w-full border border-border rounded-lg bg-card overflow-hidden">
      <style jsx global>
        {editorStyles}
      </style>
      <EditorRoot>
        <EditorContent
          extensions={editorExtensions}
          className="novel-editor p-4 min-h-[500px]"
          onCreate={({ editor }) => {
            editorRef.current = editor;
            if (initialContent && !hasSetInitialContent.current) {
              editor.commands.setContent(initialContent);
              hasSetInitialContent.current = true;
            }
          }}
          onUpdate={({ editor }) => {
            const html = editor.getHTML();
            console.log(html);
            onChange?.(html);
          }}
          editorProps={{
            attributes: {
              class: "focus:outline-none min-h-[500px]",
            },
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-border bg-popover px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">결과 없음</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  key={item.command}
                  value={item.title}
                  onCommand={({ editor, range }) => {
                    switch (item.command) {
                      case "heading1":
                        editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
                        break;
                      case "heading2":
                        editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
                        break;
                      case "heading3":
                        editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
                        break;
                      case "bulletList":
                        editor.chain().focus().deleteRange(range).toggleBulletList().run();
                        break;
                      case "orderedList":
                        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                        break;
                      case "blockquote":
                        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                        break;
                      case "codeBlock":
                        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                        break;
                      case "image":
                        const imageUrl = window.prompt("이미지 URL을 입력하세요:");
                        if (imageUrl) {
                          editor.chain().focus().deleteRange(range).setImage({ src: imageUrl }).run();
                        }
                        break;
                      case "link":
                        const linkUrl = window.prompt("링크 URL을 입력하세요:");
                        if (linkUrl) {
                          editor.chain().focus().deleteRange(range).setLink({ href: linkUrl }).run();
                        }
                        break;
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-border bg-popover shadow-md">
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleBold().run()}
              className="p-2 hover:bg-accent"
            >
              <Bold className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
              className="p-2 hover:bg-accent"
            >
              <Italic className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
              className="p-2 hover:bg-accent"
            >
              <Strikethrough className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleCode().run()}
              className="p-2 hover:bg-accent"
            >
              <Code className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                const url = window.prompt("링크 URL을 입력하세요:");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className="p-2 hover:bg-accent"
            >
              <LinkIcon className="h-4 w-4" />
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
