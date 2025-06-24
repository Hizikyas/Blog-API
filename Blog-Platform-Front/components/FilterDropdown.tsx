import React from "react";
import { Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FilterDropdownProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categories = [
  { value: "ALL", label: "All Categories" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "FOOD", label: "Food" },
  { value: "TRAVEL", label: "Travel" },
  { value: "EDUCATION", label: "Education" }
];

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selectedCategory,
  onCategoryChange,
  isOpen,
  onToggle
}) => {
  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    onToggle();
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={onToggle}
        className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filter
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={onToggle}
          />
          <Card className="absolute top-full right-0 mt-2 w-48 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg animate-scale-in">
            <CardContent className="p-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategorySelect(category.value)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {category.label}
                  </span>
                  {selectedCategory === category.value && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;