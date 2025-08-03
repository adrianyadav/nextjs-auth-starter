import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const meta: Meta = {
    title: 'Design System/Overview',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
    render: () => (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">🎨 Brand Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <div className="h-20 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-lg"></div>
                        <p className="text-sm font-medium">Royal Gradient</p>
                        <p className="text-xs text-gray-600">Primary brand color</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 bg-[#4F46E5] rounded-lg"></div>
                        <p className="text-sm font-medium">Royal Blue</p>
                        <p className="text-xs text-gray-600">#4F46E5</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 bg-[#6366F1] rounded-lg"></div>
                        <p className="text-sm font-medium">Royal Light</p>
                        <p className="text-xs text-gray-600">#6366F1</p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-20 bg-[#3730A3] rounded-lg"></div>
                        <p className="text-sm font-medium">Royal Dark</p>
                        <p className="text-xs text-gray-600">#3730A3</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">🔤 Typography</h2>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Heading 1 - Page Titles</h1>
                        <h2 className="text-2xl font-semibold mb-2">Heading 2 - Section Headers</h2>
                        <h3 className="text-xl font-semibold mb-2">Heading 3 - Subsection Headers</h3>
                        <h4 className="text-lg font-semibold mb-2">Heading 4 - Card Titles</h4>
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg">Large text - Important content</p>
                        <p className="text-base">Base text - Regular content</p>
                        <p className="text-sm">Small text - Secondary information</p>
                        <p className="text-xs">Extra small text - Captions and metadata</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">🧩 Buttons</h2>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <Button className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                            Primary Button
                        </Button>
                        <Button variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white">
                            Secondary Button
                        </Button>
                        <Button variant="destructive">Destructive Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button size="sm" className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                            Small
                        </Button>
                        <Button size="default" className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                            Default
                        </Button>
                        <Button size="lg" className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                            Large
                        </Button>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">📝 Form Elements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="input">Input Field</Label>
                            <Input id="input" placeholder="Enter text..." />
                        </div>
                        <div>
                            <Label htmlFor="textarea">Textarea</Label>
                            <Textarea id="textarea" placeholder="Enter description..." />
                        </div>
                        <div>
                            <Label htmlFor="select">Select Dropdown</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="option1">Option 1</SelectItem>
                                    <SelectItem value="option2">Option 2</SelectItem>
                                    <SelectItem value="option3">Option 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="checkbox" />
                            <Label htmlFor="checkbox">Checkbox</Label>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">🏷️ Badges & Tags</h2>
                <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">🃏 Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card description goes here</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This is the card content area where you can put any content.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Interactive Card</CardTitle>
                            <CardDescription>Hover to see effects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full bg-gradient-royal hover:bg-gradient-royal-light text-white">
                                Action Button
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Badge>Tag 1</Badge>
                                <Badge variant="secondary">Tag 2</Badge>
                                <p className="text-sm text-gray-600">Some additional content here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">📱 Responsive Grid</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="h-20 bg-gradient-to-br from-royal/10 to-royal/5 rounded-lg mb-2"></div>
                                <h4 className="font-semibold">Grid Item {i + 1}</h4>
                                <p className="text-sm text-gray-600">Responsive grid example</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    ),
}; 