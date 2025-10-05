import axiosClient from '@/lib/axios';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await axiosClient.get('/category/get-all-categories');
    return response.data;
  },

  // Create category
  createCategory: async (formData: FormData) => {
    const response = await axiosClient.post('/category/create-category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update category
  updateCategory: async (id: string, formData: FormData) => {
    const response = await axiosClient.put(`/category/update-category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: string) => {
    const response = await axiosClient.delete(`/category/delete-category/${id}`);
    return response.data;
  },
};
