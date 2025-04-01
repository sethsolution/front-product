import { CustomerManager } from "@/components/customers/customer-manager";

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <CustomerManager />
    </div>
  );
}
