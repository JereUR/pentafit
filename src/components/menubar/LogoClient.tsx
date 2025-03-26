'use client'

import Link from 'next/link'
import Image from 'next/image'

import expandedLogo from '@/assets/logo-full.webp'
import reduceLogo from '@/assets/logo-reduce.webp'
import { useClientFacility } from '@/contexts/ClientFacilityContext'

interface LogoProps {
  isExpanded: boolean
}

export function LogoClient({ isExpanded }: LogoProps) {
  const { logoWebUrl } = useClientFacility()

  return (
    <Link href="/" className={`flex items-center justify-center font-semibold ${isExpanded ? 'w-full' : 'w-16'}`}>
      {isExpanded ? (
        <Image src={logoWebUrl || expandedLogo} alt='Expanded logo' width={80} height={20} className='p-2 object-contain' />
      ) : (
        <Image src={logoWebUrl || reduceLogo} alt='Reduced logo' width={40} height={40} className='h-full' />
      )}
    </Link>
  )
}

