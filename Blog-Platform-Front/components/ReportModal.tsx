import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: number | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, blogId }) => {
  const [formData, setFormData] = useState({
    type: "",
    reason: "",
    reporter: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    // Check sessionStorage for nickname
    const storedNickname = sessionStorage.getItem("nickname");
    setNickname(storedNickname);
    if (storedNickname) {
      setFormData((prev) => ({ ...prev, reporter: storedNickname }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reporter.trim()) {
      setError("Please provide a reporter nickname");
      return;
    }
    if (!formData.type) {
      setError("Please select a report type");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("https://blog-platform-qqqt.vercel.app/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: blogId,
          type: formData.type,
          reason: formData.reason.trim() || undefined,
          reporter: formData.reporter.trim() || "someone",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit report");
      }

      alert("Report submitted successfully!");
      setFormData({ type: "", reason: "", reporter: nickname || "" });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit report");
      console.error("Error submitting report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !blogId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <Card className="relative w-full max-w-md max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b dark:border-gray-800">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Report Post
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reporter" className="text-sm font-medium">
                Reporter Nickname *
              </Label>
              {nickname ? (
                <p className="text-gray-600 dark:text-gray-300">{nickname}</p>
              ) : (
                <Input
                  id="reporter"
                  placeholder="Enter your nickname (defaults to 'anonymous')"
                  value={formData.reporter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reporter: e.target.value }))}
                  className="w-full"
                  required
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Report Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value, reason: "" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCAM">Scam</SelectItem>
                  <SelectItem value="OFFENSIVE">Offensive Content</SelectItem>
                  <SelectItem value="SPAM">Spam</SelectItem>
                  <SelectItem value="COPYRIGHT">Copyright Violation</SelectItem>
                  <SelectItem value="MISINFORMATION">Misinformation</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type && (
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Additional Details (Optional)
                </Label>
                <Input
                  id="reason"
                  placeholder="Provide more details (optional)"
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  className="w-full"
                />
              </div>
            )}
            <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-800">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading || !formData.reporter.trim() || !formData.type}
              >
                {isLoading ? "Submitting..." : "Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportModal;