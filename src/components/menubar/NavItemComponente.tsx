import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { NavItem } from '@/types/sidebar'

interface NavItemProps {
  item: NavItem
  isExpanded: boolean
  isOpen: boolean
  onToggle: () => void
}

export function NavItemComponent({ item, isExpanded, isOpen, onToggle }: NavItemProps) {
  const pathname = usePathname()

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button
            variant="noHover"
            className={cn(
              'w-full justify-start link-progress rounded-r-full text-sm md:text-base',
              !isExpanded && 'lg:justify-center'
            )}
          >
            <item.icon className={cn('h-5 w-5', !isExpanded && 'lg:mr-0')} />
            {(isExpanded || !isExpanded) && (
              <span className={cn('ml-2', !isExpanded && 'lg:hidden')}>
                {item.title}
              </span>
            )}
            <ChevronRight
              className={cn(
                'ml-auto h-5 w-5 transition-transform',
                isOpen && 'rotate-90',
                !isExpanded && 'lg:hidden'
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.items.map((subItem) => (
            <Button
              key={subItem.href}
              variant="noHover"
              asChild
              className={cn(
                'w-full justify-start pl-10 link-progress rounded-r-full first:mt-1 text-sm md:text-base',
                pathname === subItem.href && 'bg-primary',
                !isExpanded && 'lg:hidden'
              )}
            >
              <Link href={subItem.href}>{subItem.title}</Link>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="noHover"
      asChild
      className={cn(
        'w-full justify-start link-progress rounded-r-full py-2 text-sm md:text-base',
        pathname === item.href && 'bg-primary',
        !isExpanded && 'lg:justify-center'
      )}
    >
      <Link href={item.href!}>
        <item.icon className={cn('h-5 w-5', !isExpanded && 'lg:mr-0')} />
        <span className={cn('ml-2', !isExpanded && 'lg:hidden')}>
          {item.title}
        </span>
      </Link>
    </Button>
  )
}

