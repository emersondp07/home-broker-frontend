import { Order } from "../models";

async function getOrders(wallet_id: string): Promise<Order[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`,
    {
      next: {
        tags: [`orders-wallet-${wallet_id}`],
        // revalidate: isHomeBrokerClosed() ? 60 * 60 : 5,
        revalidate: 1,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => response);

  return response;
}

export async function MyOrders(props: { wallet_id: string }) {
  const orders = await getOrders(props.wallet_id);

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
