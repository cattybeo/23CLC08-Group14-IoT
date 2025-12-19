import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBrokerUrl() {
  return `wss://${import.meta.env.MQTT_URL}:${import.meta.env.MQTT_WEBSOCKET_PORT}/mqtt`;
}
