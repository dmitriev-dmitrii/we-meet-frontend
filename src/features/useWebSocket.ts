import { MEET_WEB_SOCKET_EVENTS } from "@/constatnts/meetWebSocket";
import {computed, ref} from "vue";
const webSocketQueue: any[] = [];
const webSocketMessageHandlersMap: Map<MEET_WEB_SOCKET_EVENTS, Set<Function>> = new Map();

const reconnectDelay = 1000; // Начальная задержка в миллисекундах для реконекта
let reconnectAttempts = 0; // Отслеживание количества попыток реконекта

const WEB_SOCKET_URL = import.meta.env.VITE_WE_MEET_API_URL
let ws:WebSocket

const currentWebSocketState = ref(3)
// TODO пробнуть смотреть через прокси js или setter
// CONNECTING: 0
// OPEN: 1
// CLOSING: 2
// CLOSED: 3

export const useWebSocket = () => {

   const onWebSocketMessage = async (event: MessageEvent) => {
        const { data } = event;
        //@ts-ignore
        const payload = JSON.parse(data);
        const { type } = payload;
        console.log(payload)
        if (!type && !webSocketMessageHandlersMap.has(type)) {
            console.warn(`WebSocket , onSocketMessage - empty callback for event type:"${type}"`);
            return;
        }

        const callbacksSet = webSocketMessageHandlersMap.get(type);

        if (!callbacksSet) {
            console.warn(`WebSocket No handlers found for event type "${type}"`);
            return;
        }

        try {
            const callbacksPromises = Array.from(callbacksSet).map((callback) => {
                return callback(payload);
            });

            await Promise.all(callbacksPromises);
        } catch (e) {
            console.log(`WebSocket error of ws handle, message type :"${type}", err:` ,e )
        }
    };


    const setupWebSocketMessageHandlers = (eventsMap: Partial<Record<MEET_WEB_SOCKET_EVENTS, [Function]>>) => {
        if (!Object.keys(eventsMap).length) {
            return;
        }

        for (const [type, callbacksArr] of Object.entries(eventsMap)) {
            webSocketMessageHandlersMap.set(type as MEET_WEB_SOCKET_EVENTS, new Set(callbacksArr));
        }
    };

    async  function sendWebSocketMessage(payload: any) {
        if (ws?.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket is not OPEN , message added to webSocketQueue');
            webSocketQueue.push(payload);
            return;
        }

        ws.send(JSON.stringify(payload));
    }


    const  onWebSocketOpen = async () => {
        currentWebSocketState.value =  WebSocket.OPEN
        console.log('WebSocket connected');
        reconnectAttempts = 0;


        while (webSocketQueue.length > 0) {

            if (ws.readyState !== WebSocket.OPEN) {
                return;
            }

            const message = webSocketQueue.shift();
            await  sendWebSocketMessage(message)
        }

    };
    const onWebSocketClose = (event: CloseEvent) => {
        currentWebSocketState.value =  WebSocket.CLOSED
        console.log('WebSocket closed', event);
        reconnectAttempts++;
        const delay = Math.min(reconnectDelay * reconnectAttempts, 30000); // Ограничение до 30 секунд
        console.log(`WebSocket reconnect try ${delay}ms...`);
        setTimeout(() => {
            connectToWebSocket();
        }, delay);
    };

    const  onWebSocketError = (error: any) => {
        currentWebSocketState.value =  WebSocket.CLOSED
        if (!reconnectAttempts) {
            console.error('WebSocket error:', error);
        }

    };

    const connectToWebSocket = () => {
        currentWebSocketState.value =  WebSocket.CONNECTING
        ws = new WebSocket(WEB_SOCKET_URL);
        ws.onopen = onWebSocketOpen
        ws.onmessage = onWebSocketMessage
        ws.onerror = onWebSocketError
        ws.onclose =  onWebSocketClose
        return ws
    };

    return {
        setupWebSocketMessageHandlers,
        sendWebSocketMessage,
        connectToWebSocket,
        currentWebSocketState,
    };
};


