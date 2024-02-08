"use client";

import { Navbar } from "flowbite-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function DefaultNavbar() {
  const pathname = usePathname();
  const params = useParams();

  const caminho = pathname !== "/favicon.ico" ? pathname : "/wallet1";
  const parametro =
    params.wallet_id !== "favicon.ico" ? params.wallet_id : "wallet1";

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        {/* <Image
          className="mr-3 h-6 sm:h-9"
          alt="Full Cycle Invest"
          src="/logo.png"
          width={37}
          height={40}
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Emerson Invest
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          active={caminho === `/${parametro}`}
          as={Link}
          href={`/${parametro}`}
        >
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Ativos</Navbar.Link>
      </Navbar.Collapse>
      <div className="flex md:order-2 text-white">Olá {parametro}</div>
    </Navbar>
  );
}
