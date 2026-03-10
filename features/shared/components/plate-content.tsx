'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSlateEditor, type Value } from 'platejs';
import { deserializeMd, MarkdownPlugin } from '@platejs/markdown';
import { EditorStatic } from '@/components/ui/editor-static';
import { BaseBasicBlocksKit } from '@/components/editor/plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '@/components/editor/plugins/basic-marks-base-kit';
import { BaseCodeBlockKit } from '@/components/editor/plugins/code-block-base-kit';
import { BaseLinkKit } from '@/components/editor/plugins/link-base-kit';
import { BaseListKit } from '@/components/editor/plugins/list-base-kit';
import { BaseMathKit } from '@/components/editor/plugins/math-base-kit';
import { BaseMediaEmbedPlugin } from '@platejs/media';
import { MediaEmbedElementStatic } from '@/components/ui/media-embed-node-static';

const staticPlugins = [
  ...BaseBasicBlocksKit,
  ...BaseBasicMarksKit,
  ...BaseCodeBlockKit,
  ...BaseLinkKit,
  ...BaseListKit,
  ...BaseMathKit,
  BaseMediaEmbedPlugin.withComponent(MediaEmbedElementStatic),
  MarkdownPlugin,
];

function parseContent(content: string): Value | null {
  // Try Plate JSON first (from admin editor)
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as Value;
    }
  } catch {
    // Not JSON — treat as markdown
  }

  // Deserialize markdown to Slate nodes
  const mdEditor = createSlateEditor({ plugins: staticPlugins });
  const nodes = deserializeMd(mdEditor, content);
  if (nodes && nodes.length > 0) {
    return nodes as Value;
  }

  return null;
}

interface PlateContentProps {
  content: string;
  className?: string;
}

export function PlateContent({ content, className }: PlateContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useMemo(() => {
    if (!mounted || !content) return null;

    const value = parseContent(content);
    if (!value) return null;

    return createSlateEditor({
      plugins: staticPlugins,
      value,
    });
  }, [mounted, content]);

  if (!editor) return null;

  return (
    <EditorStatic
      editor={editor}
      variant="none"
      className={className}
    />
  );
}
