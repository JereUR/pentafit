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
    <div className="flex flex-col justify-around items-center min-h-[85vh] py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center flex flex-col items-center"
      >
        <Image
          src={logoImage}
          alt="PENTA Logo"
          width={360}
          height={120}
          className="mx-auto mb-6"
          priority
        />
        <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8">
          Potencia tu negocio deportivo
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-4xl h-64 bg-gradient-to-r from-primary to-orange-400 rounded-2xl shadow-2xl flex items-center justify-center"
      >
        <span className="text-4xl font-bold text-white">Tu éxito, nuestra misión</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Descubre nuestros servicios
        </h2>
        <Button
          className="text-lg px-6 py-3 bg-primary hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
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

