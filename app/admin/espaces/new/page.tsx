import ShopEditPage from "../[id]/page"

export default function NewShopPage() {
  // Render the ShopEditPage component with "new" as the ID
  return <ShopEditPage params={{ id: "new" }} />
}
