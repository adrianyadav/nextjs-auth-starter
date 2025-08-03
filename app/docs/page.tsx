import { readFileSync } from 'fs';
import { join } from 'path';
import { notFound } from 'next/navigation';
import MarkdownRenderer from './components/MarkdownRenderer';

export default function DocsPage() {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }

    let content = '';
    let title = 'README';

    try {
        const filePath = join(process.cwd(), 'docs', 'README.md');
        content = readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('Error reading README.md:', error);
        content = `# README Not Found\n\nThe README.md file could not be found in the docs directory.`;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 {title}</h1>
                    <p className="text-gray-600">Local documentation browser</p>
                </div>

                {/* Navigation */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold mb-3">Available Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <a
                            href="/docs"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                            📖 README.md
                        </a>
                        <a
                            href="/docs/STYLE_GUIDE"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            🎨 STYLE_GUIDE.md
                        </a>
                        <a
                            href="/docs/STORYBOOK"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            📚 STORYBOOK.md
                        </a>
                        <a
                            href="/docs/TESTING"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            🧪 TESTING.md
                        </a>
                        <a
                            href="/docs/OAUTH_SETUP"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            🔐 OAUTH_SETUP.md
                        </a>
                        <a
                            href="/docs/PRODUCTION_TESTING"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            🚀 PRODUCTION_TESTING.md
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm border p-8">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </div>
    );
} 