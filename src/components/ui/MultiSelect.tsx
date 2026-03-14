import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IOption {
  value: string
  label: string
}

interface ISelectBaseProps {
  label: string
  options: IOption[]
  placeholder?: string
  className?: string
}

interface IMultiSelectProps extends ISelectBaseProps {
  mode?: 'multiple'
  value: string[]
  onChange: (values: string[]) => void
}

interface ISingleSelectProps extends ISelectBaseProps {
  mode: 'single'
  value: string | undefined
  onChange: (value: string | undefined) => void
}

type ISelectProps = IMultiSelectProps | ISingleSelectProps

export function Select(props: ISelectProps) {
  const { label, options, placeholder, className, mode = 'multiple' } = props
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const toggle = (optValue: string) => {
    if (mode === 'single') {
      ;(props as ISingleSelectProps).onChange(
        (props as ISingleSelectProps).value === optValue ? undefined : optValue,
      )
      setOpen(false)
    } else {
      const current = (props as IMultiSelectProps).value
      const next = current.includes(optValue)
        ? current.filter((v: string) => v !== optValue)
        : [...current, optValue]
      ;(props as IMultiSelectProps).onChange(next)
    }
  }

  const displayValue = (() => {
    if (mode === 'single') {
      const selected = options.find((o) => o.value === props.value)
      return selected ? selected.label : (placeholder ?? label)
    }
    const { value } = props as IMultiSelectProps
    if (value.length === 0) return placeholder ?? label
    if (value.length === 1) return options.find((o) => o.value === value[0])?.label ?? value[0]
    return `${value.length} selected`
  })()

  const isPlaceholderShown =
    mode === 'single' ? !props.value : (props as IMultiSelectProps).value.length === 0

  const isSelected = (optValue: string) =>
    mode === 'single'
      ? props.value === optValue
      : (props as IMultiSelectProps).value.includes(optValue)

  return (
    <div ref={containerRef} className={cn('relative min-w-[130px]', className)}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm',
          'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
          isPlaceholderShown ? 'text-gray-400' : 'text-gray-900',
        )}
      >
        <span className="truncate capitalize">{displayValue}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable={mode === 'multiple'}
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const selected = isSelected(option.value)
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                onClick={() => toggle(option.value)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm capitalize',
                  selected
                    ? 'bg-indigo-50 font-medium text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                {mode === 'multiple' && (
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300',
                    )}
                    aria-hidden="true"
                  >
                    {selected && (
                      <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                    )}
                  </span>
                )}
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
