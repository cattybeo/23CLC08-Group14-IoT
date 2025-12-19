import mqtt from 'mqtt';

class MQTTService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.subscriptions = new Map();
        this.messageCallbacks = [];
    }

    // Kết nối đến MQTT broker
    connect(brokerUrl, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const defaultOptions = {
                    clean: true,
                    connectTimeout: 30000,
                    reconnectPeriod: 5000,
                    keepalive: 60,
                    ...options
                };

                // Kết nối đến MQTT broker với options
                this.client = mqtt.connect(brokerUrl, defaultOptions);

                this.client.on('connect', () => {
                    // Kết nối thành công
                    this.isConnected = true;
                    resolve(this.client);
                });

                this.client.on('error', (error) => {
                    // Xử lý lỗi kết nối
                    this.isConnected = false;
                    reject(error);
                });

                this.client.on('message', (topic, message) => {
                    // Nhận tin nhắn từ topic
                    const payload = message.toString();

                    // Gọi tất cả callbacks đã đăng ký
                    this.messageCallbacks.forEach(callback => {
                        try {
                            callback(topic, payload);
                        } catch (error) {
                            // Lỗi khi xử lý callback
                        }
                    });

                    // Gọi callback riêng cho topic cụ thể
                    const topicCallbacks = this.subscriptions.get(topic);
                    if (topicCallbacks) {
                        topicCallbacks.forEach(callback => {
                            try {
                                callback(payload, topic);
                            } catch (error) {
                                // Lỗi khi xử lý callback cho topic
                            }
                        });
                    }
                });

                this.client.on('close', () => {
                    // Kết nối bị đóng
                    this.isConnected = false;
                });

                this.client.on('offline', () => {
                    // MQTT offline
                    this.isConnected = false;
                });

                this.client.on('reconnect', () => {
                    // Đang kết nối lại
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // Subscribe vào một topic
    subscribe(topic, callback) {
        if (!this.client || !this.isConnected) {
            return false;
        }

        return new Promise((resolve, reject) => {
            this.client.subscribe(topic, (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                // Lưu callback cho topic này
                if (!this.subscriptions.has(topic)) {
                    this.subscriptions.set(topic, []);
                }

                if (callback) {
                    this.subscriptions.get(topic).push(callback);
                }

                resolve(true);
            });
        });
    }

    // Unsubscribe khỏi một topic
    unsubscribe(topic) {
        if (!this.client || !this.isConnected) {
            return false;
        }

        return new Promise((resolve, reject) => {
            this.client.unsubscribe(topic, (error) => {
                if (error) {
                    // Lỗi khi unsubscribe topic
                    reject(error);
                    return;
                }

                // Xóa topic khỏi subscriptions
                this.subscriptions.delete(topic);
                resolve(true);
            });
        });
    }

    // Publish tin nhắn đến một topic
    publish(topic, message, options = {}) {
        if (!this.client || !this.isConnected) {
            // Chưa kết nối đến MQTT broker
            return false;
        }

        return new Promise((resolve, reject) => {
            const messageStr = typeof message === 'object' ? JSON.stringify(message) : String(message);

            this.client.publish(topic, messageStr, options, (error) => {
                if (error) {
                    // Lỗi khi publish tin nhắn
                    reject(error);
                    return;
                }

                // Gửi tin nhắn thành công
                resolve(true);
            });
        });
    }

    // Đăng ký callback cho tất cả tin nhắn nhận được
    onMessage(callback) {
        if (typeof callback === 'function') {
            this.messageCallbacks.push(callback);
            return () => {
                // Trả về hàm để remove callback
                const index = this.messageCallbacks.indexOf(callback);
                if (index > -1) {
                    this.messageCallbacks.splice(index, 1);
                }
            };
        }
    }

    // Ngắt kết nối
    disconnect() {
        if (this.client) {
            return new Promise((resolve) => {
                this.client.end(false, () => {
                    // Ngắt kết nối và dọn dẹp
                    this.isConnected = false;
                    this.subscriptions.clear();
                    this.messageCallbacks = [];
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }

    // Kiểm tra trạng thái kết nối
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            subscribedTopics: Array.from(this.subscriptions.keys())
        };
    }
}

// Tạo instance singleton
const mqttService = new MQTTService();

export default mqttService;
