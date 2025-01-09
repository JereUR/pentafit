import { RefObject } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import logoImage from "@/assets/logo-full.webp"

export default function BannerSection({
  servicesRef
}: {
  servicesRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="flex flex-col justify-around items-center min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center flex flex-col items-center w-full max-w-4xl"
      >
        <Image
          src={logoImage}
          alt="PENTA Logo"
          width={360}
          height={120}
          className="mx-auto mb-6 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] h-auto"
          priority
        />
        <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-8">
          Potencia tu establecimiento deportivo
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-4xl h-40 sm:h-48 lg:h-64 bg-gradient-to-r from-primary to-orange-400 rounded-2xl shadow-2xl flex items-center justify-center px-4 sm:px-6"
      >
        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
          Tu éxito, nuestra misión
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Descubre nuestros servicios
        </h2>
        <Button
          className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => {
            servicesRef.current?.scrollIntoView({
              behavior: 'smooth'
            })
          }}
        >
          Explorar
        </Button>
      </motion.div>
    </div>
  )
}

