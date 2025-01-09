import Image from 'next/image'

import logoImg from '@/assets/logo-full.webp'
import { Skeleton } from '@/components/ui/skeleton'

export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-[#0a0a1b] flex flex-col items-center justify-center p-4">
      <div className="relative w-80 h-80 sm:w-60 sm:h-60">
        <Image
          src={logoImg}
          alt="Pentafit Logo"
          fill
          sizes="(max-width: 640px) 10rem, 14rem"
          priority
          className="object-contain animate-pulse"
        />
      </div>
      <div className="flex space-x-2 sm:space-x-3">
        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full [animation-delay:0.6s]" />
        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full [animation-delay:0.8s]" />
      </div>
      <div className="mt-6 sm:mt-8 text-sm sm:text-base italic text-gray-400 text-center animate-pulse">
        Cargando soluciones para un mejor rendimiento
      </div>
    </div>
  )
}

