import ItemCard from "../components/Item";

const getItems = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/item/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-cache",
      mode: "cors"
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
export default async function Page() {
  const items = await getItems();
  return (
    <div className="container">
      <div className="items">
        {
          items?.map((item: any) => (
            <ItemCard key={item.id} item={item} />
          ))
        }
      </div>
    </div>
  );
}