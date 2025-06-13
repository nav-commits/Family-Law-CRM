import { ClientList } from "@/components/clients/client-list";
// import { ClientStats } from "@/components/clients/client-stats";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      {/* <ClientStats /> */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <ClientList />
        </div>
      </div>
    </div>
  );
}
