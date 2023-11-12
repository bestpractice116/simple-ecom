import Link from "next/link";
import "./styles.scss";

type Item = {
  id: string;
  name: string,
  description: string,
  image: string,
  price: number,
}
export default function ItemCard({ item }: { item: Item }) {
  const truncate = (input: string) =>
    input.length > 60 ? `${input.substring(0, 60)}...` : input;
  return (
    <div className="item-card">
      <div className="item-card__header">
        <div className="image">
          <img src={item.image}
               alt={item.name} />
        </div>
      </div>
      <div className="item-card__body">
        <div className="title">
          <h3>
            {item.name}
          </h3>
        </div>
        <div className="description">
          {truncate(item.description ? item.description : "")}
        </div>
        <div className="price">
          £ - {item.price}
        </div>
      </div>
      <div className="item-card__footer">
        <Link href={`${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout-session/${encodeURIComponent(item.id)}`}
              className="checkout">
          <button>
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}