'use client'

import { useRef } from 'react'

import BannerSection from '@/components/home/BannerSection'
import ContactForm from '@/components/home/ContactForm'
import ServicesSection from '@/components/home/ServicesSection'
import PriceSection from '@/components/home/PriceSection'

export default function HomePageComponent() {
  const servicesRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="flex flex-col min-w-full bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="flex w-full justify-center pt-20 min-h-screen">
        <div className="container mx-auto px-4">
          <BannerSection servicesRef={servicesRef} />
        </div>
      </main>
      <div className="container mx-auto px-4">
        <ServicesSection servicesRef={servicesRef} />
        <div className="my-20">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
            Nuestros Planes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PriceSection
              title="Básico"
              description={['Acceso básico al gimnasio', 'Asesoramiento inicial']}
              price="AR$20000"
            />
            <PriceSection
              title="Premium"
              description={[
                'Acceso completo al gimnasio',
                'Clases grupales ilimitadas',
                'Asesoramiento nutricional',
                'Seguimiento personalizado'
              ]}
              price="AR$30000"
              featured={true}
            />
            <PriceSection
              title="Elite"
              description={[
                'Todo lo incluido en Premium',
                'Entrenador personal',
                'Acceso a spa y sauna',
                'Suplementos nutricionales',
                'Estacionamiento gratuito'
              ]}
              price="AR$40000"
            />
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}

