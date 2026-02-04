import { useEffect, useState, useMemo, useCallback } from "react";
import {
  collection, doc, getDocs, updateDoc, query, orderBy, where
} from "firebase/firestore";
import { useAuth } from "@/hooks";
import { dbCadastro } from "@/services/firebase";

function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  const status = useMemo(() => ({
    pending: "pending",
    inProgress: "inProgress",
    outForDelivery: "outForDelivery",
    delivered: "delivered"
  }), []);

  const getOrders = useCallback(async () => {
    const uid = user?.uid;

    if (!uid) {
      console.error("Usuário não autenticado");
      return;
    }

    const ordersQuery = query(
      collection(dbCadastro, "orders"),
      where("userId", "==", uid),
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
  }, [user, status]);

  const updateOrder = useCallback(async ({ orderId, status }) => {
    const orderRef = doc(dbCadastro, "orders", orderId);
    await updateDoc(orderRef, { status });
    await getOrders();
  }, [getOrders]);

  useEffect(() => {
    if (user) getOrders();
  }, [user, getOrders]);

  return { orders, status, updateOrder };
}

export default useOrders;
