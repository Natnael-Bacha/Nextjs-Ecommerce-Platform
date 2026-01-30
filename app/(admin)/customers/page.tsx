import { getCustomerInfo } from "@/lib/actions/customerInfo";
import CustomersClientPage from "./customerClient";

export default async function CustomersServerPage() {
  const data = await getCustomerInfo();
  return <CustomersClientPage data={data} />;
}
