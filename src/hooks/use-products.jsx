import { useQuery } from '@tanstack/react-query';
import * as productService from '@/services/product.service';

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await productService.fetchAll();
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            return data;
        },
    });
}