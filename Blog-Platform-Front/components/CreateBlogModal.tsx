import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
    nickname: sessionStorage.getItem("nickname") || ""
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isNicknameSet, setIsNicknameSet] = useState(!!sessionStorage.getItem("nickname"));

  useEffect(() => {
    const storedNickname = sessionStorage.getItem("nickname");
    if (storedNickname) {
      setFormData(prev => ({ ...prev, nickname: storedNickname }));
      setIsNicknameSet(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.content || (!isNicknameSet && !formData.nickname.trim())) return;

    if (!isNicknameSet && formData.nickname.trim()) {
      sessionStorage.setItem("nickname", formData.nickname);
      setIsNicknameSet(true);
    }

    const sendData = {
      title: formData.title,
      blog: formData.content,
      category: formData.category,
      image: imagePreview || "",
      nickname: formData.nickname || "Anonymous"
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData)
      });

      if (res.ok) {
        console.log("Blog created:", sendData);
        setFormData({ title: "", category: "", content: "", image: "", nickname: sessionStorage.getItem("nickname") || "" });
        setImagePreview(null);
        onClose();
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setFormData({ title: "", category: "", content: "", image: "", nickname: sessionStorage.getItem("nickname") || "" });
    setImagePreview(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, nickname: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b dark:border-gray-800">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Blog Post
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isNicknameSet && (
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">
                  Nickname *
                </Label>
                <Input
                  id="nickname"
                  placeholder="Enter your nickname..."
                  value={formData.nickname}
                  onChange={handleNicknameChange}
                  className="w-full"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter your blog title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: "" }));
                      }}
                    >
                      Remove Image
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
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Drag and drop or click to upload
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Content *
              </Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="w-full resize-none"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={!formData.title || !formData.category || !formData.content || (!isNicknameSet && !formData.nickname.trim())}
              >
                Publish Blog
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBlogModal;