'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { MembershipLevel } from '@prisma/client'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MEMBERSHIP_OPTIONS } from '@/types/user'
import { useMembershipUpdateMutation } from './mutation'
import { membershipUpdateSchema, MembershipUpdateValues } from '@/lib/validation'
import LoadingButton from '@/components/LoadingButton'

interface MembershipUpdateFormProps {
  user: {
    id: string
    firstName: string
    lastName: string
    membershipLevel: MembershipLevel
  }
}

export function MembershipUpdateForm({ user }: MembershipUpdateFormProps) {
  const updateMutation = useMembershipUpdateMutation()

  const form = useForm<MembershipUpdateValues>({
    resolver: zodResolver(membershipUpdateSchema),
    defaultValues: {
      membershipLevel: user.membershipLevel,
      cardNumber: '',
      holder: '',
      expirationDate: '',
      cvv: '',
    },
  })

  function onSubmit(data: MembershipUpdateValues) {
    updateMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Selecciona tu nueva membresía</CardTitle>
            <CardDescription>
              Elige el plan que mejor se adapte a tus necesidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="membershipLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {MEMBERSHIP_OPTIONS.map((option) => (
                        <FormItem key={option.level} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option.level} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <span className="font-semibold">{option.level}</span>
                            <span className="ml-2 text-muted-foreground">${option.price}/mes</span>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Información de pago</CardTitle>
            <CardDescription>
              Ingresa los datos de tu tarjeta para procesar el pago
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de tarjeta</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012 3456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="holder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y apellido del titular</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre/s y apellido/s" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Fecha de expiración</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <LoadingButton type="submit" className="w-full" loading={updateMutation.isPending}>
              Actualizar y Pagar
            </LoadingButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

