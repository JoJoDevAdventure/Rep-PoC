"use client";

import { appState } from "@/appState"; // Import appState for language preference
import { useState } from "react";

const MainContent = () => {
  const isEnglish = appState.isEnglish; // Check if English is selected

  // Fake data for orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "John Doe",
      items: "2x Burger, 1x Fries",
      total: "$25.99",
      progress: 50, // Progress percentage
    },
    {
      id: 2,
      customer: "Jane Smith",
      items: "1x Pizza, 1x Soda",
      total: "$15.49",
      progress: 80,
    },
    {
      id: 3,
      customer: "Michael Brown",
      items: "3x Tacos, 2x Margaritas",
      total: "$45.00",
      progress: 20,
    },
  ]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">
          {isEnglish ? "Orders" : "Pedidos"}
        </h1>
        <button
          onClick={() => alert(isEnglish ? "Add Order" : "Agregar Pedido")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition"
        >
          {isEnglish ? "+ Order" : "+ Pedido"}
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            {/* Order Information */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {order.customer}
                </h2>
                <span className="text-sm text-gray-500">
                  {isEnglish ? `Order #${order.id}` : `Pedido #${order.id}`}
                </span>
                <p className="text-sm text-gray-500">
                  {isEnglish ? `Items: ${order.items}` : `Artículos: ${order.items}`}
                </p>
                <p className="text-sm text-gray-500">
                  {isEnglish ? `Total: ${order.total}` : `Total: ${order.total}`}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-orange-500 rounded-full"
                  style={{ width: `${order.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {isEnglish
                  ? `${order.progress}% completed`
                  : `${order.progress}% completado`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;