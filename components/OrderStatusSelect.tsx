"use client";

import { useTransition } from "react";
import { changeOrderStatus } from "../lib/actions/customerInfo";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { useRouter } from "next/navigation";
interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) =>
        startTransition(async () => {
          await changeOrderStatus(orderId, e.target.value as OrderStatus);
          router.refresh();
        })
      }
      className="border rounded-md px-2 py-1 text-sm"
    >
      {Object.values(OrderStatus).map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
