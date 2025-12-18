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

    add(product) {
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
            .eq('id', id);
    },

    subscribeToChanges(callback) {
        return supabase
            .channel('products-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                callback
            )
            .subscribe();
    }
};

export const fetchAll = productService.fetchAll;
export const fetchById = productService.fetchById;
export const add = productService.add;
export const update = productService.update;
export const remove = productService.remove;
export const subscribeToChanges = productService.subscribeToChanges;