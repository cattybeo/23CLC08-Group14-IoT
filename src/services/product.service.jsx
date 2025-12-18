import supabase from '@/api/supabase.client.jsx';

export const productService = {
    fetchAll() {
        return supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
    },

    fetchById(id) {
        return supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
    },

    create(product) {
        return supabase
            .from('products')
            .insert([product])
            .select()
            .single();
    },

    update(id, updates) {
        return supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
    },

    remove(id) {
        return supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select()
            .single();
    },

    fetchProductChartData(productId) {
        return supabase
            .from('product_sales_timeseries')
            .select('sale_day, total_sold')
            .eq('product_id', productId)
            .order('sale_day', { ascending: true });
    },

    subscribeToSales(callback) {
        return supabase
            .channel('sales-channel')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'sales_logs' },
                callback
            )
            .subscribe();
    }
};

export const fetchAll = productService.fetchAll;
export const fetchById = productService.fetchById;
export const create = productService.create;
export const update = productService.update;
export const remove = productService.remove;
export const fetchProductChartData = productService.fetchProductChartData;
export const subscribeToSales = productService.subscribeToSales;