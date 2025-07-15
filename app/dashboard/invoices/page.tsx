import { InvoiceStats } from '../../features/invoices/invoice-stats';
import { InvoiceList } from '../../features/invoices/invoice-list';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Invoices</h1> 
      <InvoiceStats />
      <InvoiceList />
    </div>
  );
}