import { marked } from "marked";

/**
 * Renders admin-authored markdown as HTML. Content only comes from the
 * password-protected admin panel (not public user input), so we skip an
 * extra sanitization pass here — keep that in mind if this ever accepts
 * content from untrusted sources.
 */
export default function Markdown({ content, className = "" }: { content: string; className?: string }) {
  const html = marked.parse(content || "", { async: false }) as string;
  // eslint-disable-next-line react/no-danger
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
