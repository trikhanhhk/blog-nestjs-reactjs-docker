import rehypeParse from "rehype-parse/lib";
import rehypeRemark from "rehype-remark";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkStringify from "remark-stringify/lib";

export function markdownToHtml(markdownText: string) {
    const file = remark().use(remarkHtml).processSync(markdownText);
    return String(file);
}

export function htmlToMarkdown(htmlText: string) {
    const file = remark()
        .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
        .use(rehypeRemark)
        .use(remarkStringify)
        .processSync(htmlText);

    return String(file);
}
