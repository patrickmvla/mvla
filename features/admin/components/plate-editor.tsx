"use client";

import { useCallback, useMemo, useState } from "react";
import { normalizeNodeId } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  CodePlugin,
  StrikethroughPlugin,
} from "@platejs/basic-nodes/react";
import { Bold, Italic, Underline, Code, Strikethrough, FileCode } from "lucide-react";

import { AutoformatKit } from "@/components/editor/plugins/autoformat-kit";
import { BasicNodesKit } from "@/components/editor/plugins/basic-nodes-kit";
import { CodeBlockKit } from "@/components/editor/plugins/code-block-kit";
import { LinkKit } from "@/components/editor/plugins/link-kit";
import { ListKit } from "@/components/editor/plugins/list-kit";
import { MarkdownKit } from "@/components/editor/plugins/markdown-kit";
import { MathKit } from "@/components/editor/plugins/math-kit";
import { MediaKit } from "@/components/editor/plugins/media-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { ToolbarGroup } from "@/components/ui/toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { LinkToolbarButton } from "@/components/ui/link-toolbar-button";
import { InlineEquationToolbarButton } from "@/components/ui/equation-toolbar-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Youtube, Twitter } from "lucide-react";
import { isUrl, KEYS } from "platejs";
import { ToolbarButton } from "@/components/ui/toolbar";
import { toggleCodeBlock } from "@platejs/code-block";
import { useEditorRef } from "platejs/react";

function EmbedToolbarButton({
  icon,
  tooltip,
  title,
  hint,
  placeholder,
}: {
  icon: React.ReactNode;
  tooltip: string;
  title: string;
  hint: string;
  placeholder: string;
}) {
  const editor = useEditorRef();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function handleEmbed() {
    if (url && isUrl(url)) {
      editor.tf.insertNodes({
        type: KEYS.mediaEmbed,
        url,
        children: [{ text: "" }],
      });
      setUrl("");
      setOpen(false);
    }
  }

  return (
    <>
      <ToolbarButton tooltip={tooltip} onClick={() => setOpen(true)}>
        {icon}
      </ToolbarButton>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <p className="text-[11px] text-muted-foreground">{hint}</p>
          </DialogHeader>
          <div className="flex gap-2">
            <input
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEmbed();
                }
              }}
              placeholder={placeholder}
              className="flex-1 border border-border bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-muted-foreground/50 focus:border-muted-foreground"
            />
            <button
              type="button"
              onClick={handleEmbed}
              className="cursor-pointer border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-primary"
            >
              embed
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CodeBlockToolbarButton() {
  const editor = useEditorRef();
  return (
    <ToolbarButton
      tooltip="Code Block (⌘⌥8)"
      onClick={() => {
        toggleCodeBlock(editor);
      }}
    >
      <FileCode className="size-4" />
    </ToolbarButton>
  );
}

const emptyValue = normalizeNodeId([
  { children: [{ text: "" }], type: "p" },
]);

interface AdminPlateEditorProps {
  value: string;
  onChange: (json: string) => void;
  placeholder?: string;
}

export function AdminPlateEditor({
  value,
  onChange,
  placeholder = "Start writing...",
}: AdminPlateEditorProps) {
  const initialValue = useMemo(() => {
    if (!value) return emptyValue;
    try {
      return JSON.parse(value);
    } catch {
      return emptyValue;
    }
  }, []);

  const editor = usePlateEditor({
    plugins: [
      ...BasicNodesKit,
      ...CodeBlockKit,
      ...LinkKit,
      ...ListKit,
      ...MathKit,
      ...MediaKit,
      ...MarkdownKit,
      ...AutoformatKit,
    ],
    value: initialValue,
  });

  const handleChange = useCallback(
    ({ value: newValue }: { value: unknown }) => {
      onChange(JSON.stringify(newValue));
    },
    [onChange]
  );

  return (
    <Plate editor={editor} onChange={handleChange}>
      <FixedToolbar className="rounded-t border border-border bg-background">
        <ToolbarGroup>
          <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘B)">
            <Bold className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="Italic (⌘I)">
            <Italic className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={UnderlinePlugin.key}
            tooltip="Underline (⌘U)"
          >
            <Underline className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={StrikethroughPlugin.key}
            tooltip="Strikethrough"
          >
            <Strikethrough className="size-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘E)">
            <Code className="size-4" />
          </MarkToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <CodeBlockToolbarButton />
          <InlineEquationToolbarButton />
          <LinkToolbarButton />
          <EmbedToolbarButton
            icon={<Youtube className="size-4" />}
            tooltip="Embed YouTube"
            title="embed youtube"
            hint="paste a youtube or vimeo url"
            placeholder="https://youtube.com/watch?v=..."
          />
          <EmbedToolbarButton
            icon={<Twitter className="size-4" />}
            tooltip="Embed Tweet"
            title="embed tweet"
            hint="paste an x.com or twitter.com url"
            placeholder="https://x.com/user/status/..."
          />
        </ToolbarGroup>
      </FixedToolbar>
      <EditorContainer className="rounded-b border border-t-0 border-border">
        <Editor variant="none" className="min-h-[200px] px-4 py-3 text-sm" placeholder={placeholder} />
      </EditorContainer>
    </Plate>
  );
}
