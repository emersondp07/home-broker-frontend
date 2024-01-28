import MyWallet from "../components/MyWallet";

export default async function HomePage({
  params,
}: {
  params: { wallet_id: string };
}) {
  return (
    <main>
      <article>
        <h1>Meus investimentos</h1>
      </article>
      <MyWallet wallet_id={params.wallet_id} />
    </main>
  );
}
