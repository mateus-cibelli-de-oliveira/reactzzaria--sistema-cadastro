import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  runTransaction
} from "firebase/firestore";
import { db } from "@/services/firebase";

function useCollection(collectionName) {
  const [data, setData] = useState(null);
  const { pathname } = useLocation();

  const fetchCollectionData = useCallback(() => {
    const loadData = async () => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(docs);
    };

    loadData();
  }, [collectionName]);

  const add = useCallback(
    (payload) =>
      addDoc(collection(db, collectionName), payload),
    [collectionName]
  );

  const edit = useCallback(
    async (id, data) => {
      const docRef = doc(collection(db, collectionName), id);
      await updateDoc(docRef, data);
    },
    [collectionName]
  );

  const remove = useCallback(async (id) => {
    await deleteDoc(doc(db, collectionName, id));
    fetchCollectionData();
  }, [collectionName, fetchCollectionData]);

  const removePizzaSize = useCallback(
    async (id) => {
      const pizzaSizeRef = doc(db, "pizzasSizes", id);
      const flavoursRef = collection(db, "pizzasFlavours");

      try {
        await runTransaction(db, async (transaction) => {
          const sizeSnap = await transaction.get(pizzaSizeRef);

          if (!sizeSnap.exists()) {
            throw new Error("Esse tamanho não existe!");
          }

          // Remove o tamanho de pizza selecionado
          transaction.delete(pizzaSizeRef);

          // Busca todos os sabores cadastrados
          const flavoursSnap = await getDocs(flavoursRef);

          flavoursSnap.forEach((flavourDoc) => {
            const data = flavourDoc.data();
            if (!data?.value || !(id in data.value)) return;

            // Remove do campo value o tamanho que foi excluído
            const { [id]: _, ...newValue } = data.value;

            transaction.update(
              doc(db, "pizzasFlavours", flavourDoc.id),
              { value: newValue }
            );
          });
        });

        // Atualiza a interface após a transacão ser concluída com sucesso
        fetchCollectionData();
        console.log("Transaction finalizada com sucesso!");
      } catch (error) {
        console.error("Erro na transaction:", error);
      }
    },
    [fetchCollectionData]
  );

  useEffect(() => {
    fetchCollectionData();
  }, [pathname, fetchCollectionData]);

  return { data, add, edit, remove, removePizzaSize }
}

export default useCollection;
