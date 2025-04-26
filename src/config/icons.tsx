export const PlanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`h-5 w-5 ${className || 'text-foreground'}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 7C21 9.20914 16.9706 11 12 11C7.02944 11 3 9.20914 3 7M21 7C21 4.79086 16.9706 3 12 3C7.02944 3 3 4.79086 3 7M21 7V12M3 7V12M12 16C7.02944 16 3 14.2091 3 12M3 12V17C3 19.2091 7.02944 21 12 21"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M18 15V18M18 21V18M18 18H21M18 18H15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)

interface ExcelIconProps {
  className?: string
}

export const ExcelIcon: React.FC<ExcelIconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
    <path fill="#4CAF50" d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z" />
    <path
      fill="#FFF"
      d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z"
    />
    <path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z" />
    <path
      fill="#FFF"
      d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z"
    />
  </svg>
)

export const PdfIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 2h6l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm6 1.5v5h5M8 10h2v4H9v-3H8v3H7v-4h2zm5 0h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1v1h-1v-3zm5 0h-1v4h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
    <text x="8" y="17" font-size="5" font-family="Arial, sans-serif" fill="currentColor">PDF</text>
  </svg>
)


