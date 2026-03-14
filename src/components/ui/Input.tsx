import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
}

export const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ label, onClear, value, onChange, placeholder, id, className, ...rest }, ref) => {
    const showClear = onClear && value
    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={id} className="mb-1 block text-xs font-medium text-gray-600">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-2.5 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            ref={ref}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-8 text-sm text-gray-900 placeholder:text-gray-400',
              'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...rest}
          />
          {showClear && (
            <button
              type="button"
              aria-label="clear search"
              onClick={onClear}
              className="absolute right-2 flex items-center justify-center rounded p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    )
  },
)
Input.displayName = 'Input'
