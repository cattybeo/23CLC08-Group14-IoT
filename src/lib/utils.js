import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBrokerUrl() {
  return `wss://${import.meta.env.VITE_MQTT_URL}:${import.meta.env.VITE_MQTT_WEBSOCKET_PORT}/mqtt`;
}
