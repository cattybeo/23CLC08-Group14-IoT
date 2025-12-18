import { useQuery } from '@tanstack/react-query';
import { useProducts } from './use-products';
import { productService } from '@/services/product.service';

export const useDashboardStats = () => {
    const { data: products = [], isLoading: productsLoading } = useProducts();

    const { data: salesData, isLoading: salesLoading } = useQuery({
        queryKey: ['sales-today'],
        queryFn: async () => {
            const { data, error } = await productService.fetchSalesToday();
            if (error) {
                console.error('Error fetching sales today:', error);
                return null;
            }
            return data;
        },
    });

    const stats = {
        totalProducts: products.length,
        lowStockAlert: products.filter(p =>
            p.current_stock > 0 && p.current_stock < (p.init_stock * 0.2)
        ).length,
        outOfStock: products.filter(p => p.current_stock === 0).length,
        totalUnits: products.reduce((sum, p) => sum + p.current_stock, 0),
        soldToday: salesData?.today_total || 0,
        growthPercentage: salesData?.growth_percentage || 0,
        stockUtilization: products.length > 0
            ? (products.reduce((sum, p) => sum + (p.current_stock / p.init_stock) * 100, 0) / products.length)
            : 0,
    };

    return {
        data: stats,
        isLoading: productsLoading || salesLoading,
    };
};
