import axiosClient from '@/lib/axios';

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    const response = await axiosClient.get('/order/get-all-orders');
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await axiosClient.get('/order/user-orders');
    return response.data;
  },

  // Create order
  createOrder: async (orderData: any) => {
    const response = await axiosClient.post('/order/create-order', orderData);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    const response = await axiosClient.put(`/order/update-order-status/${id}`, { status });
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: string) => {
    const response = await axiosClient.delete(`/order/delete-order/${id}`);
    return response.data;
  },
};
