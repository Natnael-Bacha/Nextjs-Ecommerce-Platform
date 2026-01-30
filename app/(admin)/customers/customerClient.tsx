"use client";

import { useRouter } from "next/navigation";


interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  name: string; 
  phoneNumber: string | null;
  role: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date; 
  updatedAt: Date;
}

interface CustomersClientPageProps {
  data: Customer[];
}

interface CustomersClientPageProps {
  data: Customer[];
}

export default function CustomersClientPage({
  data,
}: CustomersClientPageProps) {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Role</th>
              <th className="px-6 py-3 text-left font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((customer) => (
              <tr
                key={customer.id}
                className="cursor-pointer hover:bg-gray-50 transition"
                onClick={() => {
                  router.push(`/customer/${customer.id}`);
                }}
              >
                <td className="px-6 py-4 font-medium">
                  {customer.name ?? "—"}
                </td>
                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      customer.role === "admin"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {customer.role ?? "User"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
