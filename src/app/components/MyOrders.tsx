import { Order } from "../models";

async function getOrderstAssets(wallet_id: string): Promise<Order[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`
  )
    .then((response) => response.json())
    .then((response) => response);

  return response;
}

export async function MyOrders(props: { wallet_id: string }) {
  console.log(props);

  const orders = await getOrderstAssets(props.wallet_id);

  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={Number(order.id)}>
            {order.asset.id} - {order.shares} - R$ {order.price} -{" "}
            {order.status}
          </li>
        );
      })}
    </ul>
  );
}
