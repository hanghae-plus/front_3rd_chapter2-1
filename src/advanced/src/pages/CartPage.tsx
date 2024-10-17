import { CartClient } from "@/components/Cart";
import { Layout } from "@/components/shared";

export default function CartPage() {
  return (
    <Layout.Page>
      <Layout.Title>장바구니</Layout.Title>
      <CartClient />
    </Layout.Page>
  );
}
