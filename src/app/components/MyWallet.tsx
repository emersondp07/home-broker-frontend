import { WalletAsset } from "../models";
import { Button } from "./Flowbite-components";

async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/assets`,
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

export default async function MyWallet(props: { wallet_id: string }) {
  const walletAssets = await getWalletAssets(props.wallet_id);

  return (
    <ul>
      <Button color="success">teste</Button>
      {walletAssets.map((walletAsset) => {
        return (
          <li key={Number(walletAsset.id)}>
            {walletAsset.asset.id} - {walletAsset.shares} - R${" "}
            {walletAsset.asset.price}
          </li>
        );
      })}
    </ul>
  );
}
