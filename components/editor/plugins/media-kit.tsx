'use client';

import { MediaEmbedPlugin } from '@platejs/media/react';

import { MediaEmbedElement } from '@/components/ui/media-embed-node';

export const MediaKit = [
  MediaEmbedPlugin.withComponent(MediaEmbedElement),
];
