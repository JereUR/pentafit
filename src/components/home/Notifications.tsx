"use client"

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

import kyInstance from "@/lib/ky"
import InfiniteScrollContainer from "../InfiniteScrollContainer"
import { NotificationsPage } from "@/types/notification"
import Notification from "./Notification"
import NotificationsSkeleton from "../skeletons/NotificationsSkeleton"

export default function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      })
    },
    onError(error) {
      console.error(
        "No se pudieron marcar las notificaciones como leídas",
        error,
      )
    },
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  const notifications = data?.pages.flatMap((page) => page.notifications) || []

  if (status === "pending") {
    return <NotificationsSkeleton />
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Todavía no tienes ninguna notificación.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Ocurrió un error al cargar las notificaciones.
      </p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-2"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}
