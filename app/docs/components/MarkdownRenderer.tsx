import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const parseMarkdown = (markdown: string) => {
        const lines = markdown.split('\n');
        const elements: React.ReactNode[] = [];
        let currentList: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeBlockLang = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Handle code blocks
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    // End code block
                    elements.push(
                        <pre key={`code-${i}`} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 border">
                            <code className="text-sm font-mono text-gray-800">
                                {codeBlockContent.join('\n')}
                            </code>
                        </pre>
                    );
                    inCodeBlock = false;
                    codeBlockContent = [];
                } else {
                    // Start code block
                    inCodeBlock = true;
                    codeBlockLang = line.slice(3).trim();
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }

            // Handle headers
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={`h1-${i}`} className="text-3xl font-bold mb-4 text-gray-900">
                        {line.slice(2)}
                    </h1>
                );
                continue;
            }

            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={`h2-${i}`} className="text-2xl font-semibold mt-8 mb-3 text-gray-800">
                        {line.slice(3)}
                    </h2>
                );
                continue;
            }

            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={`h3-${i}`} className="text-xl font-semibold mt-6 mb-2 text-gray-800">
                        {line.slice(4)}
                    </h3>
                );
                continue;
            }

            if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={`h4-${i}`} className="text-lg font-semibold mt-4 mb-2 text-gray-800">
                        {line.slice(5)}
                    </h4>
                );
                continue;
            }

            // Handle lists
            if (line.match(/^[\*\-] /)) {
                const listItem = line.slice(2);
                currentList.push(
                    <li key={`li-${i}`} className="ml-4 mb-1">
                        {parseInlineMarkdown(listItem)}
                    </li>
                );
                continue;
            }

            if (line.match(/^\d+\. /)) {
                const listItem = line.replace(/^\d+\. /, '');
                currentList.push(
                    <li key={`li-${i}`} className="ml-4 mb-1">
                        {parseInlineMarkdown(listItem)}
                    </li>
                );
                continue;
            }

            // Flush current list if we encounter a non-list item
            if (currentList.length > 0 && !line.match(/^[\*\-] |^\d+\. /)) {
                elements.push(
                    <ul key={`ul-${i}`} className="list-disc mb-4">
                        {currentList}
                    </ul>
                );
                currentList = [];
            }

            // Handle horizontal rules
            if (line.trim() === '---') {
                elements.push(
                    <hr key={`hr-${i}`} className="my-6 border-gray-300" />
                );
                continue;
            }

            // Handle blockquotes
            if (line.startsWith('> ')) {
                elements.push(
                    <blockquote key={`quote-${i}`} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
                        {line.slice(2)}
                    </blockquote>
                );
                continue;
            }

            // Handle empty lines
            if (line.trim() === '') {
                if (currentList.length > 0) {
                    elements.push(
                        <ul key={`ul-${i}`} className="list-disc mb-4">
                            {currentList}
                        </ul>
                    );
                    currentList = [];
                }
                continue;
            }

            // Handle regular paragraphs
            elements.push(
                <p key={`p-${i}`} className="mb-4">
                    {parseInlineMarkdown(line)}
                </p>
            );
        }

        // Flush any remaining list
        if (currentList.length > 0) {
            elements.push(
                <ul key="ul-final" className="list-disc mb-4">
                    {currentList}
                </ul>
            );
        }

        return elements;
    };

    const parseInlineMarkdown = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let currentText = text;

        // Handle bold text
        currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
            parts.push(<strong key={`bold-${parts.length}`} className="font-bold">{content}</strong>);
            return `__BOLD_${parts.length - 1}__`;
        });

        // Handle italic text
        currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
            parts.push(<em key={`italic-${parts.length}`} className="italic">{content}</em>);
            return `__ITALIC_${parts.length - 1}__`;
        });

        // Handle inline code
        currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
            parts.push(
                <code key={`code-${parts.length}`} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                    {content}
                </code>
            );
            return `__CODE_${parts.length - 1}__`;
        });

        // Handle links
        currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            parts.push(
                <a key={`link-${parts.length}`} href={url} className="text-blue-600 hover:text-blue-800 hover:underline">
                    {text}
                </a>
            );
            return `__LINK_${parts.length - 1}__`;
        });

        // Split by placeholders and reconstruct
        const textParts = currentText.split(/__(BOLD|ITALIC|CODE|LINK)_\d+__/);
        const result: React.ReactNode[] = [];

        for (let i = 0; i < textParts.length; i++) {
            if (textParts[i]) {
                result.push(textParts[i]);
            }
            if (parts[i]) {
                result.push(parts[i]);
            }
        }

        return result.length > 0 ? result : text;
    };

    return (
        <div className="prose prose-lg max-w-none">
            {parseMarkdown(content)}
        </div>
    );
} 