import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectDropdownProps {
  options: Array<{ id: string; label: string; type?: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export default function MultiSelectDropdown({ 
  options, 
  selected, 
  onChange, 
  placeholder 
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (optionId: string) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter(id => id !== optionId));
    } else {
      onChange([...selected, optionId]);
    }
  };

  const clearSelection = () => {
    onChange([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return options.find(opt => opt.id === selected[0])?.label || placeholder;
    return `${selected.length} items selected`;
  };

  // Filter options by type
  const residentialOptions = options.filter(opt => opt.type === 'residential');
  const commercialOptions = options.filter(opt => opt.type === 'commercial');
  const otherOptions = options.filter(opt => opt.type === 'other');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-between w-full px-3 py-2 text-sm text-foreground bg-transparent outline-none cursor-pointer ${
          isOpen ? 'text-primary' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate ${selected.length > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
          {getDisplayText()}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            className="ml-2 p-0.5 rounded-full hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <ChevronDown 
          className={`w-3.5 h-3.5 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-[400px] left-[-16px] bg-background border border-border rounded-lg shadow-lg max-h-[450px] overflow-y-auto">
          <div className="p-3">
            {/* Residential Section */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Residential
              </div>
              {/* First Row: Flat, House/Villa, Plot */}
              <div className="flex gap-2 mb-2">
                {residentialOptions.slice(0, 3).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                      selected.includes(option.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-foreground hover:bg-accent'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* Second Row: 1 BHK to 5+ BHK */}
              <div className="flex flex-wrap gap-2">
                {residentialOptions.slice(3).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                      selected.includes(option.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-foreground hover:bg-accent'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Commercial Section */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Commercial
              </div>
              {/* First Row: Office Space, Shop/Showroom, Commercial Land */}
              <div className="flex gap-2 mb-2">
                {commercialOptions.slice(0, 3).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                      selected.includes(option.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-foreground hover:bg-accent'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* Second Row: Warehouse/Godown, Industrial Building, Industrial Shed */}
              <div className="flex gap-2">
                {commercialOptions.slice(3).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                      selected.includes(option.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-foreground hover:bg-accent'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Property Types Section */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Other Property Types
              </div>
              <div className="flex gap-2">
                {otherOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                      selected.includes(option.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border text-foreground hover:bg-accent'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}