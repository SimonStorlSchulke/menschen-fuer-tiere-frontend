export function renderStrapiRichText(json: RichTextNode[]): string {
    return json.map(renderRichTextNode).join('');
}

function renderRichTextNode(node: RichTextNode): string {
    switch (node.type) {
        case 'heading':
            const headingLevel = node.level ?? 1;
            return `<h${headingLevel}>${renderChildren(node.children)}</h${headingLevel}>`;
        case 'paragraph':
            return `<p>${renderChildren(node.children)}</p>`;
        case 'text':
            let text = node.text ?? '';
            if (node.bold) {
                text = `<strong>${text}</strong>`;
            }
            if (node.italic) {
                text = `<em>${text}</em>`;
            }
            return text;
        case 'link':
            return `<a  ${convertButtonLinks(`href="${node.url}"`)}>${renderChildren(node.children)}</a>`;
        case 'image':
            return `<img src="${node.image?.url}" alt="${node.image?.alternativeText}" width="${node.image?.width}" height="${node.image?.height}" />`;
        case 'list':
            const listTag = node.format === 'ordered' ? 'ol' : 'ul';
            return `<${listTag}>${renderChildren(node.children)}</${listTag}>`;
        case 'list-item':
            return `<li>${renderChildren(node.children)}</li>`;
        case 'quote':
            return `<blockquote>${renderChildren(node.children)}</blockquote>`;
        default:
            return '';
    }
}

/** converts `href="https://google.de BUTTON" into href="https://google.de" class="button" */
function convertButtonLinks(linkUrl: string) {
  if(linkUrl.includes("-BUTTON-SECONDARY")) {
    return linkUrl.replace("-BUTTON-SECONDARY", "").replace('href=', 'class="button secondary sui my-3 inline-block" href=');
  }
  if(linkUrl.includes("-BUTTON-CTO")) {
    return linkUrl.replace("-BUTTON-CTO", "").replace('href=', 'class="button primary sui my-3 inline-block" href=');
  }
  if(linkUrl.includes("-BUTTON")) {
    return linkUrl.replace("-BUTTON", "").replace('href=', 'class="button primary sui my-3 inline-block" href=');
  }
  return linkUrl;
}

function renderChildren(children?: RichTextNode[]): string {
    return (children ?? []).map(renderRichTextNode).join('');
}

export type RichTextNode = {
    type: string;
    children?: RichTextNode[];
    text?: string;
    bold?: boolean;
    italic?: boolean;
    url?: string;
    level?: number;
    format?: string;
    image?: {
        name: string;
        alternativeText: string;
        url: string;
        caption: string | null;
        width: number;
        height: number;
        formats: {
            thumbnail: {
                name: string;
                url: string;
            }
        };
    };
};
