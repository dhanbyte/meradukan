import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Visual variant of the textarea
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'ghost'
  /**
   * Size of the textarea
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Whether the textarea is in an error state
   * @default false
   */
  error?: boolean
  /**
   * Helper text to display below the textarea
   */
  helperText?: string
  /**
   * Label text for the textarea
   */
  label?: string
  /**
   * Whether the label should be visually hidden
   * @default false
   */
  hideLabel?: boolean
}

/**
 * A customizable textarea component with support for various states and sizes.
 * 
 * @example
 * ```tsx
 * <Textarea 
 *   label="Description"
 *   placeholder="Enter your description"
 *   rows={4}
 *   variant="bordered"
 *   error={!!errors.description}
 *   helperText={errors.description?.message}
 *   {...register('description')}
 * />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  variant = 'default',
  size = 'md',
  error = false,
  helperText,
  label,
  hideLabel = false,
  id: idProp,
  ...props
}, ref) => {
  // Generate a unique ID if one isn't provided
  const id = React.useId()
  const textareaId = idProp || `textarea-${id}`
  const helperTextId = helperText ? `helper-text-${id}` : undefined
  
  const textarea = (
    <textarea
      id={textareaId}
      className={cn(
        // Base styles
        'flex w-full rounded-md border bg-background text-foreground',
        'ring-offset-background placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Variants
        {
          'border-input': variant === 'default',
          'border border-gray-300 focus:border-primary': variant === 'bordered',
          'border-0 bg-transparent focus:ring-0 focus:ring-offset-0': variant === 'ghost',
        },
        // Sizes
        {
          'min-h-[60px] px-2 py-1 text-sm': size === 'sm',
          'min-h-[80px] px-3 py-2 text-base': size === 'md',
          'min-h-[100px] px-4 py-3 text-lg': size === 'lg',
        },
        // Error state
        {
          'border-destructive focus-visible:ring-destructive/20': error,
        },
        className
      )}
      ref={ref}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={helperTextId}
      {...props}
    />
  )

  // If there's a label or helper text, wrap in a container
  if (label || helperText) {
    return (
      <div className="grid w-full gap-1.5">
        {label && (
          <label 
            htmlFor={textareaId}
            className={cn(
              'text-sm font-medium leading-none',
              hideLabel && 'sr-only',
              error ? 'text-destructive' : 'text-foreground'
            )}
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {textarea}
        {helperText && (
          <p 
            id={helperTextId}
            className={cn(
              'text-sm',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }

  return textarea
})

Textarea.displayName = 'Textarea'

export { Textarea }
