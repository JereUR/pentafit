import { RefObject } from 'react'
import { Dumbbell, Users, Clipboard, TrendingUp, Zap } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    id: 1,
    title: 'Gestión de Membresías',
    description: 'Sistema avanzado para administrar y hacer seguimiento de las membresías de tus clientes.',
    icon: <Users className="w-8 h-8 text-primary" />
  },
  {
    id: 2,
    title: 'Programación de Clases',
    description: 'Herramienta intuitiva para programar y gestionar clases grupales y sesiones personales.',
    icon: <Clipboard className="w-8 h-8 text-primary" />
  },
  {
    id: 3,
    title: 'Seguimiento de Progreso',
    description: 'Monitorea el progreso de tus clientes con métricas personalizadas y reportes detallados.',
    icon: <TrendingUp className="w-8 h-8 text-primary" />
  },
  {
    id: 4,
    title: 'Gestión de Equipamiento',
    description: 'Mantén un registro actualizado de tu equipamiento y programa mantenimientos preventivos.',
    icon: <Dumbbell className="w-8 h-8 text-primary" />
  },
  {
    id: 5,
    title: 'Análisis de Rendimiento',
    description: 'Obtén insights valiosos sobre el rendimiento de tu negocio con nuestras herramientas analíticas.',
    icon: <Zap className="w-8 h-8 text-primary" />
  }
]

export default function ServicesSection({
  servicesRef
}: {
  servicesRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={servicesRef} className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Nuestros Servicios
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => (
          <Card key={s.id} className="hover:shadow-lg transition-shadow duration-300 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                {s.icon}
                <span>{s.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{s.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

