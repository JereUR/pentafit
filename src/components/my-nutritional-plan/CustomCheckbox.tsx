"use client"

import { Check } from 'lucide-react'

interface CustomCheckboxProps {
  id: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
  primaryColor: string
}

export function CustomCheckbox({ id, checked, onChange, disabled = false, primaryColor }: CustomCheckboxProps) {
  return (
    <div className="flex items-center">
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        className={`h-4 w-4 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        style={{
          borderColor: checked ? primaryColor : undefined,
          backgroundColor: checked ? primaryColor : "transparent",
        }}
        onClick={onChange}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </button>
    </div>
  )
}
