import { useMemo } from "react";
import styled from "styled-components";
import {
  Table, TableBody, TableCell, TableRow, Typography
} from "@mui/material";
import { TableContainer, TableTitle, THead, Th } from "@/ui";
import { useOrders } from "@/hooks";
import { singularOrPlural } from "@/utils";

function OrderHistory() {
  const { orders, status } = useOrders();

  function formatDate(date) {
    return Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

  function getHour(date) {
    return Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  const groupedOrders = useMemo(() => {
    const deliveredOrders = orders?.[status.delivered] || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastOrders = deliveredOrders.filter((order) => {
      const deliveredDate = order.deliveredAt?.toDate?.();
      if (!deliveredDate) return false;

      deliveredDate.setHours(0, 0, 0, 0);
      return deliveredDate < today;
    });

    return pastOrders.reduce((acc, order) => {
      const deliveredDate = order.deliveredAt.toDate();
      const key = formatDate(deliveredDate);

      if (!acc[key]) acc[key] = [];
      acc[key].push(order);

      return acc;
    }, {});
  }, [orders, status]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedOrders).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/");
      const [dayB, monthB, yearB] = b.split("/");

      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

      return dateB - dateA;
    });
  }, [groupedOrders]);

  return (
    <>
      {sortedDates.length === 0 && (
        <Typography>Nenhum pedido no histórico.</Typography>
      )}

      {sortedDates.map((dateKey) => (
        <TableContainer key={dateKey}>
          <TableTitle>Pedidos entregues em {dateKey}</TableTitle>

          <Table>
            <THead>
              <TableRow>
                <Th>
                  <Typography>Informações do pedido</Typography>
                </Th>
              </TableRow>
            </THead>

            <TableBody>
              {groupedOrders[dateKey].map((order) => {
                const {
                  address,
                  number,
                  complement,
                  district,
                  code: cep,
                  city,
                  state,
                } = order.address;

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <Subtitle>
                          Horário do pedido: {getHour(order.createdAt.toDate())}
                        </Subtitle>
                      </div>

                      <div>
                        <Subtitle>Pedido:</Subtitle>

                        <ul>
                          {order.pizzas.map((pizza, index) => (
                            <li key={index}>
                              <Typography>
                                {pizza.quantity}{" "}
                                {singularOrPlural(
                                  pizza.quantity,
                                  "pizza",
                                  "pizzas"
                                )}{" "}
                                {pizza.size?.name?.toUpperCase()} de{" "}
                                {pizza.flavours
                                  .map((flavour) => flavour.name)
                                  .reduce((acc, flavour, index, array) => {
                                    if (index === 0) return flavour;
                                    if (index === array.length - 1)
                                      return `${acc} e ${flavour}`;
                                    return `${acc}, ${flavour}`;
                                  }, "")}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Subtitle>Endereço de entrega:</Subtitle>

                        <Typography>
                          {address}, {number && `n° ${number}`}{" "}
                          {complement && `, ${complement}`} <br />
                          Bairro: {district} - CEP: {cep} <br />
                          {city} / {state}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
}

const Subtitle = styled(Typography).attrs({
  variant: "button",
})`
  && {
    font-weight: bold;
  }
`;

export default OrderHistory;
