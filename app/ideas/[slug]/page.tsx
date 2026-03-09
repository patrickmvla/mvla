import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ideas, stageColor, stageIcon, complexityLabel } from "../data";
import { IdeaFooter } from "./footer";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ideas.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = ideas.find((i) => i.slug === slug);
  if (!idea) return {};

  return {
    title: `${idea.title} — ideas`,
    description: idea.description,
  };
}


export default async function IdeaPage({ params }: PageProps) {
  const { slug } = await params;
  const idea = ideas.find((i) => i.slug === slug);

  if (!idea) notFound();

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col p-6 sm:p-10">
      {/* Header */}
      <header className="mb-10">
        <Link
          href="/ideas"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          &larr; ideas
        </Link>

        {/* Stage + complexity */}
        <div className="mt-4 flex items-center gap-3">
          <div className={`flex items-center gap-1.5 ${stageColor[idea.stage]}`}>
            {stageIcon[idea.stage]}
            <span className="text-[10px] uppercase tracking-widest">
              {idea.stage}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground/50">/</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {complexityLabel[idea.complexity]}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-2 text-xl font-medium tracking-tight text-primary">
          {idea.title}
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {idea.description}
        </p>

        {/* Category + Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            {idea.category}
          </span>
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span>added {format(new Date(idea.dateAdded), "MMM d, yyyy")}</span>
          <span>updated {formatDistanceToNow(new Date(idea.lastUpdated), { addSuffix: true })}</span>
        </div>

        {/* Inspiration links */}
        {idea.inspirationLinks.length > 0 && (
          <div className="mt-4 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              inspiration
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {idea.inspirationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-0.5 text-[11px] text-muted-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                  <ArrowUpRight className="size-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Full content */}
      <div className="pt-8">{idea.content}</div>

      <IdeaFooter idea={idea} />
    </div>
  );
}
