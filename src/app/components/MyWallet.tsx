import { WalletAsset } from "../models";

async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/assets`
  )
    .then((response) => response.json())
    .then((response) => response);

  return response;
}

export default async function MyWallet(props: { wallet_id: string }) {
  const walletAssets = await getWalletAssets(props.wallet_id);

  return (
    <ul>
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
