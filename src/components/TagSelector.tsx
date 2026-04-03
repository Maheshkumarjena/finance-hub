import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useState } from 'react';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const { tags: availableTags, addTag } = useFinanceStore();
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !availableTags.includes(newTag)) {
      addTag(newTag);
      if (!selectedTags.includes(newTag)) {
        onTagsChange([...selectedTags, newTag]);
      }
      setInputValue('');
      setShowInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags (optional)</label>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer flex items-center gap-1 group"
            >
              {tag}
              <X
                className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity"
                onClick={() => handleToggleTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags
            .filter((tag) => !selectedTags.includes(tag))
            .slice(0, 6)
            .map((tag) => (
              <Button
                key={tag}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleToggleTag(tag)}
              >
                +{tag}
              </Button>
            ))}
          {!showInput && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setShowInput(true)}
            >
              + Add tag
            </Button>
          )}
        </div>
      )}

      {/* Input for New Tag */}
      {showInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Type new tag..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNewTag()}
            className="text-xs h-8"
            autoFocus
          />
          <Button type="button" size="sm" className="text-xs" onClick={handleAddNewTag}>
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setShowInput(false);
              setInputValue('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
