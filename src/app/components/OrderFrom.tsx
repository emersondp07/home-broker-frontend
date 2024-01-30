import { Button, Label, TextInput } from "flowbite-react";
import { revalidateTag } from "next/cache";

async function initTransaction(formData: FormData) {
  "use server";
  const shares = formData.get("shares");
  const price = formData.get("price");
  const wallet_id = formData.get("wallet_id");
  const asset_id = formData.get("asset_id");
  const type = formData.get("type");

  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        shares,
        price,
        asset_id,
        type,
        status: "OPEN",
        asset: {
          id: asset_id,
          symbol: "PETR4",
          price: 30,
        },
      }),
    }
  );
  revalidateTag(`orders-wallet-${wallet_id}`);

  return await response.json();
}

export function OrderForm(props: {
  asset_id: string;
  wallet_id: string;
  type: "BUY" | "SELL";
}) {
  return (
    <div>
      <h1>Order Form</h1>
      <form action={initTransaction}>
        <input name="asset_id" type="hidden" defaultValue={props.asset_id} />
        <input name="wallet_id" type="hidden" defaultValue={props.wallet_id} />
        <input name="type" type="hidden" defaultValue={"BUY"} />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="shares" value="Quantidade" />
          </div>
          <TextInput
            id="shares"
            name="shares"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>
        <br />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="shares" value="Preço R$" />
          </div>
          <TextInput
            id="price"
            name="price"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>
        <br />
        <Button
          type="submit"
          className={
            props.type === "BUY"
              ? "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              : "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          }
        >
          Confirmar {props.type === "BUY" ? "compra" : "venda"}
        </Button>
      </form>
    </div>
  );
}
