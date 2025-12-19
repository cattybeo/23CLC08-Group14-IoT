import mqttService from './mqtt.service';
import { productService } from './product.service';
import { toast } from 'sonner';
import { queryClient } from '@/App';
import { getBrokerUrl } from '@/lib/utils';

class MQTTIntegrationService {
    constructor() {
        this.isInitialized = false;
        this.salesTopic = 'group14/inventory/sale';
    }

    /// Connect và subscribe topic
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            // Kết nối đến MQTT broker
            const brokerUrl = getBrokerUrl();
            await mqttService.connect(brokerUrl, {
                clientId: `iot_dashboard_${Math.random().toString(16).slice(2, 10)}`,
                username: import.meta.env.MQTT_USERNAME,
                password: import.meta.env.MQTT_PASSWORD,
                protocol: 'wss',
                rejectUnauthorized: true
            });

            await mqttService.subscribe(this.salesTopic, this.handleSaleMessage.bind(this));
            this.isInitialized = true;

            // Thông báo kết nối thành công
            toast.success('MQTT Connected', {
                description: `Listening on ${this.salesTopic}`,
                duration: 3000
            });

        } catch (error) {
            // Thông báo lỗi kết nối
            toast.error('MQTT Connection Failed', {
                description: error.message || 'Could not connect to MQTT broker',
                duration: 5000
            });
            throw error;
        }
    }

    async handleSaleMessage(message, topic) {
        try {
            // Parse JSON message
            const saleData = JSON.parse(message);
            const { rfid_id, quantity } = saleData;

            if (!rfid_id || !quantity) {
                // Thiếu thông tin rfid_id hoặc quantity
                toast.error('Invalid Sale Data', {
                    description: 'Missing RFID or quantity information',
                    duration: 4000
                });
                return;
            }

            // Tìm sản phẩm theo RFID
            const { data: product, error: fetchError } = await productService.fetchByRfid(rfid_id);

            if (fetchError) {
                // Lỗi khi lấy sản phẩm
                return;
            }

            if (!product) {
                // Không tìm thấy sản phẩm với RFID này
                toast.warning('Product Not Found', {
                    description: `No product with RFID: ${rfid_id}`,
                    duration: 4000
                });
                return;
            }

            // Kiểm tra tồn kho
            if (product.current_stock < quantity) {
                // Không đủ hàng trong kho
                toast.error('Insufficient Stock', {
                    description: `${product.name}: Need ${quantity}, have ${product.current_stock}`,
                    duration: 5000
                });
                return;
            }

            // Cập nhật số lượng tồn kho (giảm đi)
            const newStock = product.current_stock - quantity;

            const { data: updatedProduct, error: updateError } = await productService.update(
                product.id,
                { current_stock: newStock }
            );

            if (updateError) {
                // Lỗi khi cập nhật tồn kho
                toast.error('Update Failed', {
                    description: 'Could not update stock quantity',
                    duration: 4000
                });
                return;
            }

            // Cập nhật thành công, thêm log
            await this.logSale(product, quantity, rfid_id);

            // Invalidate React Query cache để UI update
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['sales-today'] });

            // Thông báo xuất hàng thành công
            toast.success('Sale Recorded', {
                description: `${product.name} (${quantity}x) - Stock: ${newStock}`,
                duration: 4000
            });

        } catch (error) {
            // Lỗi khi xử lý tin nhắn xuất hàng
            toast.error('Sale Processing Error', {
                description: error.message || 'Failed to process sale',
                duration: 5000
            });
        }
    }

    // Add sale log vô database
    async logSale(product, quantity, rfid_id) {
        try {
            const { data, error } = await productService.logSale(product.id, quantity);

            if (error) {
                return;
            }
        } catch (error) {
            console.log(error);

        }
    }

    async disconnect() {
        if (!this.isInitialized) {
            return;
        }

        try {
            // Unsubscribe và ngắt kết nối MQTT
            await mqttService.unsubscribe(this.salesTopic);
            await mqttService.disconnect();
            this.isInitialized = false;
        } catch (error) {
            // Lỗi khi ngắt kết nối
        }
    }

    // Kiểm tra trạng thái kết nối
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            connectionStatus: mqttService.getConnectionStatus()
        };
    }
}

// Tạo singleton instance
const mqttIntegration = new MQTTIntegrationService();

export default mqttIntegration;
