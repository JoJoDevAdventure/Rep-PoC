"use client";

import { appState } from "@/appState"; // Import appState for language preference";

const MainContent = ({ orders = [] }) => {
  const isEnglish = appState.isEnglish; // Check if English is selected

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
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          {isEnglish ? "No orders" : "No hay pedidos"}
        </p>
      ) : (
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
                    {order.customerName}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {isEnglish ? `Order #${order.id}` : `Pedido #${order.id}`}
                  </span>

                  {/* Items List */}
                  <div className="mt-2">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-500">
                        {isEnglish
                          ? `${item.quantity}x ${item.name}`
                          : `${item.quantity}x ${item.name}`
                        }
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `10%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {isEnglish
                    ? `10% completed`
                    : `10% completado`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainContent;