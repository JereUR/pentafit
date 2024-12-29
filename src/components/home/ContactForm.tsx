'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface FormData {
  name: string
  lastname: string
  email: string
  message: string
  [key: string]: string
}

interface FormErrors {
  name?: string
  lastname?: string
  email?: string
  message?: string
  [key: string]: string | undefined
}

const inputFields = [
  { name: 'name', label: 'Nombre', type: 'text' },
  { name: 'lastname', label: 'Apellido', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'message', label: 'Mensaje', type: 'textarea' }
]

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const validations = () => {
    const validationErrors: FormErrors = {}
    if (!formData.name) validationErrors.name = 'Nombre es requerido'
    if (!formData.lastname) validationErrors.lastname = 'Apellido es requerido'
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Ingrese un email válido'
    }
    if (!formData.message) validationErrors.message = 'Mensaje es requerido'
    return validationErrors
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validations()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoading(false)
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      })
      setFormData({ name: '', lastname: '', email: '', message: '' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 my-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Contáctanos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full"
              />
            ) : (
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full"
              />
            )}
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </motion.div>
  )
}

