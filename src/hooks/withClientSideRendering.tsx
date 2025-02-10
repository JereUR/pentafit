import type { ComponentType } from "react"
import { useClientSide } from "../hooks/useClientSide"

export function withClientSideRendering<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithClientSideRendering(props: P) {
    const isClient = useClientSide()

    if (!isClient) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

