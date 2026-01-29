import { useEffect, useState, useMemo, useCallback } from "react";
import {
  collection, doc, getDocs, updateDoc, query, orderBy
} from "firebase/firestore";
import { db } from "@/services/firebase";

function useOrders() {
  const [orders, setOrders] = useState(null);

  const status = useMemo(() => ({
    pending: "pending",
    inProgress: "inProgress",
    outForDelivery: "outForDelivery",
    delivered: "delivered"
  }), []);

  const getOrders = useCallback(async () => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(ordersQuery);
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const initialStatus = Object.keys(status).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    const groupedOrders = docs.reduce((acc, order) => {
      const mainStatus = order.status || status.pending;
      acc[mainStatus].push(order);
      return acc;
    }, initialStatus);

    setOrders(groupedOrders);
  }, [status]);

  const updateOrder = useCallback(async ({ orderId, status }) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
    await getOrders();
  }, [getOrders]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return { orders, status, updateOrder };
}

export default useOrders;
