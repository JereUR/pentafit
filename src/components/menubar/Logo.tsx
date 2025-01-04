import Link from 'next/link'
import Image from 'next/image'

import expandedLogo from '@/assets/logo-full.webp'
import reduceLogo from '@/assets/logo-reduce.webp'

interface LogoProps {
  isExpanded: boolean
}

export function Logo({ isExpanded }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center justify-center font-semibold ${isExpanded ? 'w-full' : 'w-16'}`}>
      {isExpanded ? (
        <Image src={expandedLogo} alt='Expanded logo' width={120} height={35} className='p-2' />
      ) : (
        <Image src={reduceLogo} alt='Reduced logo' width={40} height={40} className='h-full' />
      )}
    </Link>
  )
}

