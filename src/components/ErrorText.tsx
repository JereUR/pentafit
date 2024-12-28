interface ErrorTextProps {
  errorText: string
  className?: string
}

export default function ErrorText({ errorText, className }: ErrorTextProps) {
  return (
    <p className={`text-center text-destructive ${className}`}>{errorText}</p>
  )
}