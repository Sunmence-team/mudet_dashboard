import React from "react";

const InventoryHistory = () => {
  const products = [
    { id: "001", name: "Cinnamon Herbal Extra", totalLeft: 73, totalSold: 30 },
    { id: "002", name: "Cinnamon Herbal Extra", totalLeft: 73, totalSold: 30 },
    { id: "003", name: "Cinnamon Herbal Extra", totalLeft: 73, totalSold: 30 },
  ];
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead className="border-b-[1.5px] border-b-gray-300 cursor-pointer">
        <tr className="">
          <th className="py-3 px-4 font-medium">S/N</th>
          <th className="py-3 px-4 font-medium">PRODUCT NAME</th>
          <th className="py-3 px-4 font-medium text-center">TOTAL LEFT</th>
          <th className="py-3 px-4 font-medium text-center">TOTAL SOLD</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr
            key={index}
            className={`hover:bg-gray-100 transition border-b-[1.5px] border-b-gray-300 cursor-pointer`}
          >
            <td className="py-3 px-4">{product.id}</td>
            <td className="py-3 px-4">{product.name}</td>
            <td className="py-3 px-4 text-center">{product.totalLeft}</td>
            <td className="py-3 px-4 text-center">{product.totalSold}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryHistory;
