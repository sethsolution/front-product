import { CustomerManager } from "@/components/customers/customer-manager";

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Gestión de Clientes</h1>
      </div>
      <CustomerManager />
    </div>
  );
}
