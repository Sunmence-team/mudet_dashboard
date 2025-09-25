import React from "react";
import assets from "../../assets/assets";
import ProductCard from "../../components/cards/ProductCard";

const Products = () => {
  const products = [
    {
      id: 1,
      title: "Cinnamon Herbal Extract",
      description:
        "Cinnamon herbal extract is derived from the bark of the cinnamon tree and contains powerful bioactive compounds with medicinal properties. It is used both as a health supplement and in traditional herbal medicine for its numerous therapeutic benefits.",
      imageSrc: assets.cinamon,
      pv: 16,
      price: 14000,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Products;
