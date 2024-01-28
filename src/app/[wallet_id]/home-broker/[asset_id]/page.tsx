import { MyOrders } from "../../../components/MyOrders";
import { OrderForm } from "../../../components/OrderFrom";

export default async function HomeBrokerPage(params: {
  wallet_id: string;
  asset_id: string;
}) {
  return (
    <div>
      <h1>Meus investimentos</h1>
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div>
            <OrderForm
              asset_id={params.asset_id}
              wallet_id={params.wallet_id}
            />
          </div>
          <div>
            <MyOrders wallet_id={params.wallet_id} />
          </div>
        </div>
        <div>Grafico</div>
      </div>
    </div>
  );
}