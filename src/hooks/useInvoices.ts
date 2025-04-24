import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { PAGE_SIZE } from "@/lib/prisma";
import type { InvoiceData } from "@/types/invoice";

const fetchInvoices = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ invoices: InvoiceData[]; total: number }> => {
  return kyInstance
    .get(`/api/invoices/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ invoices: InvoiceData[]; total: number }>();
};

export const useInvoices = (facilityId?: string, page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["invoices", facilityId, page, PAGE_SIZE, search],
    queryFn: () => fetchInvoices(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  });
};