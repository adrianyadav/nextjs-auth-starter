"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onImageUpload: (imageUrl: string) => void;
    currentImageUrl?: string;
    className?: string;
}

export default function ImageUpload({ onImageUpload, currentImageUrl, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
    const [mode, setMode] = useState<"upload" | "url">(currentImageUrl ? "url" : "upload");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("File too large. Maximum size is 5MB.");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Upload failed");
            }

            const { imageUrl } = await response.json();
            setPreviewUrl(imageUrl);
            onImageUpload(imageUrl);
        } catch (error) {
            console.error("Upload error:", error);
            alert(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const removeImage = () => {
        setPreviewUrl(null);
        setImageUrl("");
        onImageUpload("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUrlChange = (url: string) => {
        setImageUrl(url);
        setPreviewUrl(url);
        onImageUpload(url);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {previewUrl ? (
                <div className="relative">
                    <Card>
                        <CardContent className="p-4">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={previewUrl}
                                    alt="Outfit preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-muted-foreground">
                                    {mode === "upload" ? "Image uploaded successfully" : "Image URL added"}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Mode Toggle */}
                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant={mode === "upload" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("upload")}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                        </Button>
                        <Button
                            type="button"
                            variant={mode === "url" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("url")}
                        >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Image URL
                        </Button>
                    </div>

                    {mode === "upload" ? (
                        <Card
                            className={cn(
                                "border-2 border-dashed transition-colors",
                                dragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">
                                            Upload Outfit Image
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Drag and drop an image here, or click to select
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Supports JPEG, PNG, WebP (max 5MB)
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {isUploading ? "Uploading..." : "Choose Image"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                type="url"
                                id="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter a direct link to an image (JPEG, PNG, WebP, GIF)
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 