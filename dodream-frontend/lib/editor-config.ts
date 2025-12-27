import { StarterKit } from "novel";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  type LucideIcon,
} from "lucide-react";

export interface SuggestionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  command: string;
}

export const suggestionItems: SuggestionItem[] = [
  { title: "제목 1", description: "큰 제목", icon: Heading1, command: "heading1" },
  { title: "제목 2", description: "중간 제목", icon: Heading2, command: "heading2" },
  { title: "제목 3", description: "작은 제목", icon: Heading3, command: "heading3" },
  { title: "글머리 기호", description: "리스트 생성", icon: List, command: "bulletList" },
  { title: "번호 매기기", description: "번호 리스트", icon: ListOrdered, command: "orderedList" },
  { title: "인용문", description: "인용 블록", icon: Quote, command: "blockquote" },
  { title: "코드 블록", description: "코드 작성", icon: CodeSquare, command: "codeBlock" },
];

export const editorExtensions = [
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: { class: "border-l-4 border-border pl-4 italic text-muted-foreground my-4" },
    },
    codeBlock: {
      HTMLAttributes: { class: "rounded-md bg-muted p-4 font-mono text-sm my-4" },
    },
    code: {
      HTMLAttributes: { class: "rounded bg-muted px-1.5 py-0.5 font-mono text-sm" },
    },
    heading: {
      levels: [1, 2, 3],
    },
  }),
];

export const editorStyles = `
  .novel-editor h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  .novel-editor ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor li {
    margin-bottom: 0.25rem;
    display: list-item;
  }
  .novel-editor li > p {
    display: inline;
    margin: 0;
  }
`;

