import { cn } from "@/lib/utils";

/** Minimal markdown for public articles: headings, paragraphs, links. */
export function ArticleBody({ body, className }: { body: string; className?: string }) {
  const blocks = body.trim().split(/\n{2,}/);
  let sawTitle = false;
  return (
    <div className={cn("space-y-4 text-sm leading-relaxed text-fg", className)}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-medium tracking-tight">
              {inline(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          const Tag = sawTitle ? "h2" : "h1";
          sawTitle = true;
          return (
            <Tag key={i} className="text-3xl font-medium tracking-tight">
              {inline(trimmed.slice(3))}
            </Tag>
          );
        }
        return <p key={i}>{inline(trimmed)}</p>;
      })}
    </div>
  );
}

function inline(text: string): React.ReactNode {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = m[2]!;
    const label = m[1]!;
    const external = href.startsWith("http");
    parts.push(
      <a
        key={k++}
        href={href}
        className="text-accent underline-offset-4 hover:underline"
        rel={external ? "nofollow sponsored noopener" : undefined}
        target={external ? "_blank" : undefined}
      >
        {label}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
