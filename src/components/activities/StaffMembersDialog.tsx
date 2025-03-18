"use client"

import { useState } from "react"
import { Info, User } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { StaffMember } from "@/types/activity"

interface StaffMembersDialogProps {
  activityName: string
  staffMembers: StaffMember[]
}

export default function StaffMembersDialog({ activityName, staffMembers }: StaffMembersDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <span>{staffMembers.length}</span>
      {staffMembers.length > 0 && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogContent className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-[80vh] flex flex-col rounded-md">
              <DialogHeader>
                <DialogTitle>Personal asignado a {activityName}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-grow">
                <div className="space-y-4 p-4">
                  {staffMembers.map((staff) => (
                    <div key={staff.id} className="flex items-center gap-4 p-3 rounded-md border">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={staff.avatarUrl || undefined} alt={`${staff.firstName} ${staff.lastName}`} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-base">
                          {staff.firstName} {staff.lastName}
                        </div>
                        {staff.email && <div className="text-sm text-muted-foreground">{staff.email}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  )
}

