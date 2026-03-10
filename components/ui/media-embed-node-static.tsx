'use client';

import * as React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Tweet } from 'react-tweet';

import type { TMediaEmbedElement } from 'platejs';
import type { SlateElementProps } from 'platejs/static';

import { parseTwitterUrl, parseVideoUrl } from '@platejs/media';
import { SlateElement } from 'platejs/static';

import { cn } from '@/lib/utils';

export function MediaEmbedElementStatic(
  props: SlateElementProps<TMediaEmbedElement>
) {
  const { element } = props;
  const url = element.url as string;

  const twitterParsed = parseTwitterUrl(url);
  const videoParsed = parseVideoUrl(url);

  const isTweet = !!twitterParsed;
  const isVideo = !!videoParsed;
  const isYoutube = isVideo && videoParsed.provider === 'youtube';

  return (
    <SlateElement className="py-2.5" {...props}>
      <figure
        className="group relative m-0 mx-auto w-full max-w-lg cursor-default"
        contentEditable={false}
      >
        {isVideo && (
          <div
            className={cn(
              'relative aspect-video w-full overflow-hidden rounded-sm border border-border'
            )}
          >
            {isYoutube ? (
              <LiteYouTubeEmbed
                id={videoParsed.id!}
                title="youtube"
                wrapperClass={cn(
                  'relative block cursor-pointer bg-black bg-center bg-cover [contain:content]',
                  'after:block after:pb-[var(--aspect-ratio)] after:content-[""]',
                  '[&_>_iframe]:absolute [&_>_iframe]:top-0 [&_>_iframe]:left-0 [&_>_iframe]:size-full',
                  '[&_>_.lty-playbtn]:z-1 [&_>_.lty-playbtn]:h-[46px] [&_>_.lty-playbtn]:w-[70px] [&_>_.lty-playbtn]:rounded-[14%] [&_>_.lty-playbtn]:bg-[#212121] [&_>_.lty-playbtn]:opacity-80 [&_>_.lty-playbtn]:[transition:all_0.2s_cubic-bezier(0,_0,_0.2,_1)]',
                  '[&:hover_>_.lty-playbtn]:bg-[red] [&:hover_>_.lty-playbtn]:opacity-100',
                  '[&_>_.lty-playbtn]:before:border-[transparent_transparent_transparent_#fff] [&_>_.lty-playbtn]:before:border-y-[11px] [&_>_.lty-playbtn]:before:border-r-0 [&_>_.lty-playbtn]:before:border-l-[19px] [&_>_.lty-playbtn]:before:content-[""]',
                  '[&_>_.lty-playbtn]:absolute [&_>_.lty-playbtn]:top-1/2 [&_>_.lty-playbtn]:left-1/2 [&_>_.lty-playbtn]:[transform:translate3d(-50%,-50%,0)]',
                  '[&_>_.lty-playbtn]:before:absolute [&_>_.lty-playbtn]:before:top-1/2 [&_>_.lty-playbtn]:before:left-1/2 [&_>_.lty-playbtn]:before:[transform:translate3d(-50%,-50%,0)]',
                  '[&.lyt-activated]:cursor-[unset]',
                  '[&.lyt-activated]:before:pointer-events-none [&.lyt-activated]:before:opacity-0',
                  '[&.lyt-activated_>_.lty-playbtn]:pointer-events-none [&.lyt-activated_>_.lty-playbtn]:opacity-0!'
                )}
              />
            ) : (
              <iframe
                className="absolute top-0 left-0 size-full border-0"
                title="embed"
                src={videoParsed.url}
                allowFullScreen
              />
            )}
          </div>
        )}

        {isTweet && (
          <div
            className={cn(
              'mx-auto max-w-[550px] [&_.react-tweet-theme]:my-0'
            )}
          >
            <Tweet id={twitterParsed.id!} />
          </div>
        )}

        {!isVideo && !isTweet && (
          <div className="flex h-20 items-center justify-center rounded-sm border border-border text-xs text-muted-foreground">
            unsupported embed
          </div>
        )}
      </figure>

      {props.children}
    </SlateElement>
  );
}
