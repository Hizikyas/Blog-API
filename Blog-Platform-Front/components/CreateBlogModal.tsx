import React, { useState, useCallback, memo } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from 'next/image'

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

// Memoized form inputs to prevent unnecessary re-renders
const MemoizedInput = memo(Input);
const MemoizedTextarea = memo(Textarea);
const MemoizedSelect = memo(Select);

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    catagory: "",
    content: "",
    image: null as File | null,
    nickname: sessionStorage.getItem("nickname") || "",
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isNicknameSet] = useState(!!sessionStorage.getItem("nickname"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized handlers to prevent recreation on every render
  const handleNicknameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, nickname: e.target.value }));
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, catagory: value }));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPEG or PNG images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
    setFormData(prev => ({ ...prev, image: file }));
  }, []);

  const clearImage = useCallback(() => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.catagory || !formData.content) {
      setError("Title, category, and content are required");
      return;
    }

    const validCategories = ["TECHNOLOGY", "FOOD", "TRAVEL", "EDUCATION"];
    if (!validCategories.includes(formData.catagory)) {
      setError("Please select a valid category");
      return;
    }

    setIsLoading(true);
    setError(null);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("blog", formData.content);
    form.append("catagory", formData.catagory);
    if (formData.image) form.append("image", formData.image);
    form.append("nickname", formData.nickname.trim() || "user");

    try {
      const res = await fetch("https://blog-platform-qqqt.vercel.app/api/posts", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error((await res.json()).error || "Failed to create post");

      if (!isNicknameSet && formData.nickname.trim()) {
        sessionStorage.setItem("nickname", formData.nickname);
      }
      
      setFormData({
        title: "",
        catagory: "",
        content: "",
        image: null,
        nickname: sessionStorage.getItem("nickname") || "",
      });
      setImagePreview(null);
      
      onPostCreated?.();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [formData, isNicknameSet, onClose, onPostCreated]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b dark:border-gray-800">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Blog Post
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isNicknameSet && (
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">
                  Nickname (Optional)
                </Label>
                <MemoizedInput
                  id="nickname"
                  placeholder="Enter your nickname (defaults to 'user')"
                  value={formData.nickname}
                  onChange={handleNicknameChange}
                  className="w-full"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="catagory" className="text-sm font-medium">
                Category *
              </Label>
              <MemoizedSelect
                value={formData.catagory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="TRAVEL">Travel</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                </SelectContent>
              </MemoizedSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <MemoizedInput
                id="title"
                placeholder="Enter your blog title..."
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Featured Image (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <Image
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-lg object-cover"
                      loading="lazy"
                    />
                    <Button type="button" variant="outline" onClick={clearImage}>
                      Clear Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </label>
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Drag and drop or click to upload (JPEG/PNG, max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Content *
              </Label>
              <MemoizedTextarea
                id="content"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={handleContentChange}
                rows={8}
                className="w-full resize-none"
                required
              />
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-800">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading || !formData.title || !formData.catagory || !formData.content}
              >
                {isLoading ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(CreateBlogModal);