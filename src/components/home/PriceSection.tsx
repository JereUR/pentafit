import React from 'react'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

interface Props {
  title: string
  description: string[]
  price: string
  featured?: boolean
}

const PriceSection: React.FC<Props> = ({ title, description, price, featured = false }) => {
  return (
    <Card className={`flex flex-col ${featured ? 'border-primary border-2' : ''} shadow-xl`}>
      <CardHeader>
        <h3 className={`text-2xl font-bold ${featured ? 'text-primary' : 'text-gray-800'} dark:text-white`}>
          {title}
        </h3>
        {featured && (
          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full uppercase">
            Recomendado
          </span>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-3xl font-bold mb-4">
          {price}
          <span className="text-base font-normal text-gray-600 dark:text-gray-400"> /mes</span>
        </p>
        <ul className="space-y-2">
          {description.map((item, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span className="text-gray-600 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${featured ? 'bg-primary hover:bg-orange-600' : ''}`}>
          Contratar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PriceSection

