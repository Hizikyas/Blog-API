"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Moon, Sun, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateBlogModal from "@/components/CreateBlogModal";
import CommentModal from "@/components/CommentModal";
import FilterDropdown from "@/components/FilterDropdown";

const mockBlogs = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    category: "TECHNOLOGY",
    date: new Date(Date.now() - 2 * 60 * 1000),
    blog: "A comprehensive guide to building modern web applications with React and TypeScript...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "10 Must-Try Recipes for Food Lovers",
    category: "FOOD",
    date: new Date(Date.now() - 25 * 60 * 1000),
    blog: "Discover amazing recipes that will transform your cooking experience...",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Hidden Gems of Southeast Asia",
    category: "TRAVEL",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    blog: "Explore breathtaking destinations off the beaten path in Southeast Asia...",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "The Future of Online Education",
    category: "EDUCATION",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    blog: "How technology is revolutionizing the way we learn and teach...",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop"
  }
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 5) return "added recently";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.blog.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openCommentModal = (blogId: number) => {
    setSelectedBlogId(blogId);
    setIsCommentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black transition-all duration-500">
      <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              DriftVerse
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-light">
              Where ideas drift into stories
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-3 items-center max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
                />
              </div>

              <Button variant="outline" size="icon" className="bg-white/50 dark:bg-gray-800/50">
                <Search className="w-4 h-4" />
              </Button>

              <FilterDropdown 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </div>

            <div className="flex gap-3 items-center">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold animate-bounce"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Blog
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-md blur opacity-30 -z-10"></div>
              </Button>

              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleTheme}
                className="bg-white/50 dark:bg-gray-800/50"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {filteredBlogs.length === 0 ? (
              <Card className="p-12 text-center bg-white/50 dark:bg-gray-800/50">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No blogs found matching your criteria.
                </p>
              </Card>
            ) : (
              filteredBlogs.map((blog, index) => (
                <Card 
                  key={blog.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {blog.image && (
                        <div className="md:w-1/3">
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`p-6 flex-1 ${!blog.image ? 'w-full' : ''}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant="secondary" 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200"
                          >
                            {blog.category}
                          </Badge>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(blog.date)}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {blog.blog}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openCommentModal(blog.id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Comments
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-dashed border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                  Featured Content
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Discover trending topics and featured articles from our community.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Explore More
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-dashed border-2 border-green-200 dark:border-green-800">
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                  Join Our Community
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Connect with writers and readers from around the world.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Join Now
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <CreateBlogModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <CommentModal 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)}
        blogId={selectedBlogId}
      />
    </div>
  );
}