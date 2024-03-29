"use client";

import Link from "next/link";

import { Table } from "flowbite-react";
import useSWR from "swr";
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription";
import { fetcher } from "../../utils/fetcher";
import { Asset, WalletAsset } from "../models";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "./flow-bite-components";

// async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
//   const response = await fetch(
//     `http://localhost:3000/wallets/${wallet_id}/assets`,
//     {
//       //cache: 'no-store', processamento sempre dinamico
//       next: {
//         //revalidate: isHomeBrokerClosed() ? 60 * 60 : 5,
//         revalidate: 1,
//       },
//     }
//   )
//     .then((response) => response.json())
//     .then((response) => response);

//   return response;
// }

export default function MyWallet(props: { wallet_id: string }) {
  // const walletAssets = await getWalletAssets(props.wallet_id);
  const {
    data: walletAssets,
    error,
    mutate: mutateWalletAssets,
  } = useSWR<WalletAsset[]>(
    `http://localhost:3000/wallets/${props.wallet_id}/assets`,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: assetChanged } = useSWRSubscription(
    `http://localhost:3000/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener("asset-price-changed", async (event) => {
        console.log(event);
        const assetChanged: Asset = JSON.parse(event.data);
        await mutateWalletAssets((prev) => {
          const foundIndex = prev!.findIndex(
            (walletAsset) => walletAsset.asset_id === assetChanged.id
          );

          if (foundIndex !== -1) {
            prev![foundIndex!].asset.price = assetChanged.price;
          }
          console.log(prev);
          return [...prev!];
        }, false);
        next(null, assetChanged);
      });

      eventSource.onerror = (event) => {
        console.error(event);
        eventSource.close();
      };
      return () => {
        console.log("close event source");
        eventSource.close();
      };
    },
    {}
  );

  const { data: walletAssetUpdated } = useSWRSubscription(
    `http://localhost:3000/wallets/${props.wallet_id}/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener("wallet-asset-updated", async (event) => {
        const walletAssetUpdated: WalletAsset = JSON.parse(event.data);
        console.log(walletAssetUpdated);
        await mutateWalletAssets((prev) => {
          const foundIndex = prev?.findIndex(
            (walletAsset) =>
              walletAsset.asset_id === walletAssetUpdated.asset_id
          );
          if (foundIndex !== -1) {
            console.log("entrou aqui");
            prev![foundIndex!].shares = walletAssetUpdated.shares;
          }

          return [...prev!];
        }, false);
        next(null, walletAssetUpdated);
      });
      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };
      return () => {
        eventSource.close();
      };
    }
  );

  return (
    <Table>
      <TableHead>
        <TableHeadCell>Nome</TableHeadCell>
        <TableHeadCell>Preço R$</TableHeadCell>
        <TableHeadCell>Quant.</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Comprar/Vender</span>
        </TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {walletAssets &&
          walletAssets.map((walletAsset, key) => (
            <TableRow className="border-gray-700 bg-gray-800" key={key}>
              <TableCell className="whitespace-nowrap font-medium text-white">
                {walletAsset.asset.id} ({walletAsset.asset.symbol})
              </TableCell>
              <TableCell>{walletAsset.asset.price}</TableCell>
              <TableCell>{walletAsset.shares}</TableCell>
              <TableCell>
                <Link
                  className="font-medium hover:underline text-cyan-500"
                  href={`/${props.wallet_id}/home-broker/${walletAsset.asset.id}`}
                >
                  Comprar/Vender
                </Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
//Server Components
//Client Components
