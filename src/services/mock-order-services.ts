export const mockOrderService = {
  getOrderStatus: (orderId: string) => {
    return `
      OrderId: ${orderId}
      Status: pending
      Note: Our warehouse is currently out of stock.
    `;
  },
};
