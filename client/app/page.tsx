import ItemCard from "../components/Item";

const getItems = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/item/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-cache"
    });

    console.log(response.status);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
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
          items.map((item: any) => (
            <ItemCard key={item.id} item={item} />
          ))
        }
      </div>
    </div>
  );
}