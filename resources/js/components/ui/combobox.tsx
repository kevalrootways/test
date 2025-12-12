"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options?: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (search: string) => Promise<ComboboxOption[]> | void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function Combobox({
  options = [],
  value,
  onValueChange,
  onSearch,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  disabled = false,
  error = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [asyncOptions, setAsyncOptions] = React.useState<ComboboxOption[]>([])
  const [selectedOptionCache, setSelectedOptionCache] = React.useState<ComboboxOption | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Ensure options is always an array
  const safeOptions = React.useMemo(() => Array.isArray(options) ? options : [], [options])

  // Use async options if onSearch is provided, otherwise use static options
  const availableOptions = onSearch ? asyncOptions : safeOptions

  // Update cache when value or available options change
  React.useEffect(() => {
    if (!value || value === '') {
      setSelectedOptionCache(null)
      return
    }
    
    // First try to find in available options
    const found = availableOptions.find((option) => option.value === value)
    if (found) {
      setSelectedOptionCache(found)
      return
    }
    
    // If not in cache and not in available options, try static options
    if (!onSearch) {
      const staticFound = safeOptions.find((option) => option.value === value)
      if (staticFound) {
        setSelectedOptionCache(staticFound)
        return
      }
    }
    
    // If not found anywhere and cache doesn't match, clear cache
    if (selectedOptionCache && selectedOptionCache.value !== value) {
      setSelectedOptionCache(null)
    }
  }, [value, availableOptions, selectedOptionCache, safeOptions, onSearch])

  // Find selected option from available options or cache
  const selectedOption = React.useMemo(() => {
    if (!value || value === '') {
      return null
    }
    
    // First try to find in available options
    const found = availableOptions.find((option) => option.value === value)
    if (found) {
      return found
    }
    
    // If not found, use cached option if it matches the value
    if (selectedOptionCache && selectedOptionCache.value === value) {
      return selectedOptionCache
    }
    
    // If not in cache and not in available options, try static options
    if (!onSearch) {
      const staticFound = safeOptions.find((option) => option.value === value)
      if (staticFound) {
        return staticFound
      }
    }
    
    return null
  }, [value, availableOptions, selectedOptionCache, safeOptions, onSearch])

  // Handle async search - only when user types
  React.useEffect(() => {
    if (onSearch && open && searchValue && searchValue.trim() !== '') {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Debounce search - only fetch when user has typed something
      setIsLoading(true)
      searchTimeoutRef.current = setTimeout(() => {
        const result = onSearch(searchValue.trim())
        if (result instanceof Promise) {
          result
            .then((results) => {
              setAsyncOptions(results)
              setIsLoading(false)
            })
            .catch(() => {
              setIsLoading(false)
            })
        } else {
          setIsLoading(false)
        }
      }, 300)

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }
      }
    } else if (onSearch && open && (!searchValue || searchValue.trim() === '')) {
      // Clear options when search is empty, but keep selected option if it exists
      // The selectedOptionCache will be shown in filteredOptions
      setAsyncOptions([])
      setIsLoading(false)
    }
  }, [searchValue, onSearch, open])

  // Filter options based on search (only for static options)
  const filteredOptions = React.useMemo(() => {
    if (onSearch) {
      // For async search, include cached selected option if it exists and isn't already in the list
      const options = [...availableOptions]
      if (selectedOptionCache && value && value === selectedOptionCache.value) {
        // Check if cached option is already in the list
        const exists = options.some(opt => opt.value === selectedOptionCache.value)
        if (!exists) {
          // Prepend the cached selected option to the list
          options.unshift(selectedOptionCache)
        }
      }
      return options
    }
    if (!searchValue || searchValue.trim() === '') {
      return safeOptions
    }
    return safeOptions.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [availableOptions, safeOptions, searchValue, onSearch, selectedOptionCache, value])

  // Reset search when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("")
      setHighlightedIndex(-1)
      setAsyncOptions([])
    } else {
      // Focus the input when dropdown opens - use requestAnimationFrame for better reliability
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus()
          inputRef.current?.select() // Also select text for easier typing
        }, 10)
      })
    }
  }, [open])

  // Reset highlighted index when search changes
  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchValue])

  // Auto-highlight first option when there's only one match
  React.useEffect(() => {
    if (filteredOptions.length === 1 && searchValue) {
      setHighlightedIndex(0)
    }
  }, [filteredOptions.length, searchValue])

  const handleSelect = (optionValue: string) => {
    // Find the selected option and cache it
    const option = filteredOptions.find((opt) => opt.value === optionValue)
    if (option) {
      setSelectedOptionCache(option)
    }
    
    onValueChange?.(optionValue === value ? "" : optionValue)
    setOpen(false)
    setSearchValue("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent any default keyboard behavior that might interfere
    e.stopPropagation()
    
    if (e.key === 'Escape') {
      setOpen(false)
      setSearchValue("")
      setHighlightedIndex(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex].value)
      } else if (filteredOptions.length === 1) {
        // If there's only one option, select it
        handleSelect(filteredOptions[0].value)
      }
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            error && "border-red-500",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-full p-0" align="start">
        <div className="p-2">
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-9 w-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="max-h-60 overflow-auto w-full">
          {isLoading ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => {
                  handleSelect(option.value)
                }}
                className={cn(
                  "flex items-center justify-between cursor-pointer w-full",
                  highlightedIndex === index && "bg-accent text-accent-foreground"
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


