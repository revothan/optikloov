import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { InvoicePDF } from "@/components/InvoicePDF";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

interface InvoiceTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    sale_date: string;
    customer_name: string;
    total_amount: number;
    discount_amount: number;
    grand_total: number;
    down_payment?: number;
    remaining_balance?: number;
    customer_phone?: string;
    customer_address?: string;
  };
}

export function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["invoice-items", invoice.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_items")
        .select(`
          id,
          quantity,
          price,
          discount,
          total,
          eye_side,
          sph,
          cyl,
          axis,
          add_power,
          pd,
          sh,
          v_frame,
          f_size,
          prism,
          product_id,
          products (
            id,
            name,
            brand
          )
        `)
        .eq("invoice_id", invoice.id);

      if (error) throw error;
      return data;
    },
  });

  return (
    <tr className="border-b">
      <td className="py-4 px-4">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} items={items} />}
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Button variant="ghost" size="sm" disabled={loading || isLoading}>
              {invoice.invoice_number}
            </Button>
          )}
        </PDFDownloadLink>
      </td>
      <td className="py-4 px-4">{invoice.customer_name}</td>
      <td className="py-4 px-4">{formatPrice(invoice.total_amount)}</td>
      <td className="py-4 px-4">{formatPrice(invoice.discount_amount)}</td>
      <td className="py-4 px-4">{formatPrice(invoice.grand_total)}</td>
      <td className="py-4 px-4">
        {invoice.down_payment ? formatPrice(invoice.down_payment) : "-"}
      </td>
      <td className="py-4 px-4">
        {invoice.remaining_balance ? formatPrice(invoice.remaining_balance) : "-"}
      </td>
    </tr>
  );
}