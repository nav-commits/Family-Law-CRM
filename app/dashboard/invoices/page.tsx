import { InvoiceStats } from '@/components/invoices/invoice-stats';
import { InvoiceList } from '@/components/invoices/invoice-list';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
      
      <InvoiceStats />
      <InvoiceList />
    </div>
  );
}