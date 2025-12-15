/**
 * Mock product data for the inventory dashboard
 * 
 * TODO: MQTT Integration
 * - Subscribe to MQTT topics for real-time inventory updates
 * - Example topic: "inventory/products/{product_id}/quantity"
 * - Use a library like 'mqtt' or 'paho-mqtt' for browser-based MQTT
 * 
 * TODO: Database Integration  
 * - Replace mock data with API calls to backend database
 * - Suggested endpoints:
 *   - GET /api/products - Fetch all products
 *   - POST /api/products - Create new product
 *   - PUT /api/products/:id - Update product
 *   - DELETE /api/products/:id - Delete product
 * - Consider using React Query for caching and state management
 */
export const products = [
  { id: 1, prod_id: "PROD-001", name: "Barcode Scanner", description: "Handheld 2D Barcode Scanner", quantity: 74, maxStock: 100, createdAt: "2024-12-14T10:00:00Z", modifiedAt: "2024-12-14T10:00:00Z" },
  { id: 2, prod_id: "PROD-002", name: "RFID Reader", description: "Long-range RFID Tag Reader", quantity: 45, maxStock: 80, createdAt: "2024-12-13T09:00:00Z", modifiedAt: "2024-12-14T08:30:00Z" },
  { id: 3, prod_id: "PROD-003", name: "Temperature Sensor", description: "IoT Temperature Monitor", quantity: 0, maxStock: 50, createdAt: "2024-12-12T14:00:00Z", modifiedAt: "2024-12-12T14:00:00Z" },
  { id: 4, prod_id: "PROD-004", name: "Smart Label Printer", description: "Thermal Label Printer", quantity: 12, maxStock: 60, createdAt: "2024-12-11T11:00:00Z", modifiedAt: "2024-12-13T16:00:00Z" },
  { id: 5, prod_id: "PROD-005", name: "Inventory Tablet", description: "Android Rugged Tablet", quantity: 89, maxStock: 100, createdAt: "2024-12-10T08:00:00Z", modifiedAt: "2024-12-10T08:00:00Z" },
  { id: 6, prod_id: "PROD-006", name: "Weight Scale", description: "Digital Industrial Scale", quantity: 5, maxStock: 40, createdAt: "2024-12-09T15:00:00Z", modifiedAt: "2024-12-14T07:00:00Z" },
  { id: 7, prod_id: "PROD-007", name: "Motion Detector", description: "PIR Motion Sensor", quantity: 156, maxStock: 200, createdAt: "2024-12-08T12:00:00Z", modifiedAt: "2024-12-08T12:00:00Z" },
  { id: 8, prod_id: "PROD-008", name: "Smart Shelf Tag", description: "Electronic Shelf Label", quantity: 0, maxStock: 300, createdAt: "2024-12-07T10:00:00Z", modifiedAt: "2024-12-07T10:00:00Z" },
  { id: 9, prod_id: "PROD-009", name: "Humidity Sensor", description: "Wireless Humidity Monitor", quantity: 67, maxStock: 80, createdAt: "2024-12-06T09:00:00Z", modifiedAt: "2024-12-06T09:00:00Z" },
  { id: 10, prod_id: "PROD-010", name: "GPS Tracker", description: "Asset GPS Tracking Device", quantity: 23, maxStock: 50, createdAt: "2024-12-05T14:00:00Z", modifiedAt: "2024-12-05T14:00:00Z" },
  { id: 11, prod_id: "PROD-011", name: "NFC Tag Pack", description: "Programmable NFC Tags (100pc)", quantity: 340, maxStock: 500, createdAt: "2024-12-04T11:00:00Z", modifiedAt: "2024-12-04T11:00:00Z" },
  { id: 12, prod_id: "PROD-012", name: "Bluetooth Beacon", description: "BLE Location Beacon", quantity: 8, maxStock: 60, createdAt: "2024-12-03T08:00:00Z", modifiedAt: "2024-12-03T08:00:00Z" },
  { id: 13, prod_id: "PROD-013", name: "Smart Camera", description: "AI Inventory Camera", quantity: 0, maxStock: 30, createdAt: "2024-12-02T15:00:00Z", modifiedAt: "2024-12-02T15:00:00Z" },
  { id: 14, prod_id: "PROD-014", name: "Vibration Sensor", description: "Industrial Vibration Monitor", quantity: 42, maxStock: 50, createdAt: "2024-12-01T12:00:00Z", modifiedAt: "2024-12-01T12:00:00Z" },
  { id: 15, prod_id: "PROD-015", name: "Power Monitor", description: "Smart Power Meter", quantity: 31, maxStock: 40, createdAt: "2024-11-30T10:00:00Z", modifiedAt: "2024-11-30T10:00:00Z" },
  { id: 16, prod_id: "PROD-016", name: "Door Sensor", description: "Magnetic Door Contact", quantity: 88, maxStock: 100, createdAt: "2024-11-29T09:00:00Z", modifiedAt: "2024-11-29T09:00:00Z" },
  { id: 17, prod_id: "PROD-017", name: "CO2 Detector", description: "Carbon Dioxide Sensor", quantity: 0, maxStock: 25, createdAt: "2024-11-28T14:00:00Z", modifiedAt: "2024-11-28T14:00:00Z" },
  { id: 18, prod_id: "PROD-018", name: "Light Sensor", description: "Ambient Light Monitor", quantity: 55, maxStock: 60, createdAt: "2024-11-27T11:00:00Z", modifiedAt: "2024-11-27T11:00:00Z" },
  { id: 19, prod_id: "PROD-019", name: "Pressure Sensor", description: "Industrial Pressure Gauge", quantity: 19, maxStock: 35, createdAt: "2024-11-26T08:00:00Z", modifiedAt: "2024-11-26T08:00:00Z" },
  { id: 20, prod_id: "PROD-020", name: "Flow Meter", description: "Digital Flow Sensor", quantity: 7, maxStock: 30, createdAt: "2024-11-25T15:00:00Z", modifiedAt: "2024-11-25T15:00:00Z" },
];

// Chart data for stock history
export const stockHistoryData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Stock Level",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "hsl(160, 84%, 39%)",
      backgroundColor: "hsl(160, 84%, 39%)",
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

// Dashboard stats
export const dashboardStats = {
  totalProducts: 1234,
  lowStockAlert: 99,
  soldToday: 120,
  totalUnits: 1000,
  outOfStock: 36,
  stockUtilization: 32.88,
};
