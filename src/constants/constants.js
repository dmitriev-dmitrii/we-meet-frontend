import {peerConnections} from "@/store/webRtcStore.js";

export const WEB_SOCKET_EVENTS = {
    'WS_CONNECTION': 'ws-connection',
    'WS_CLOSE': 'ws-close',

    'RTC_SEND_ME_OFFER': '1',
    'RTC_OFFER': '2',
    'RTC_ANSWER': '3',
    'RTC_ICE_CANDIDATE': '4',
}

export const DATA_CHANNELS_EVENTS = {
    'DATA_CHANEL_ON_MESSAGE': 'onmessage',
}

export const DATA_CHANNELS_MESSAGE_TYPE = {
    'DATA_CHANEL_TEXT_MESSAGE': '1',
    'DATA_CHANEL_UPDATE_MEDIA_TRACK_STATE': '2',
}

export const PEER_CONNECTIONS_STATE_STATUSES = {
    CHECKING:'checking',
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    FAILED: "failed",
    CLOSED: "closed",
}

export const MEDIA_TRACK_KIND = {
    'AUDIO': 'audio',
    'VIDEO': 'video'
}


export const BUS_EVENTS = {
    UPDATE_PEER_CONNECTION_STATUS: '0',
    UPDATE_REMOTE_USER_MEDIA_STREAM: '1',
    UPDATE_REMOTE_USER_MEDIA_TRACK_STATE:'2',
    DATA_CHANEL_OPEN: '3',
    DATA_CHANEL_CLOSE: '4',
};

export const DISCONNECTED_STATE_STATUSES = [
    PEER_CONNECTIONS_STATE_STATUSES.FAILED,
    PEER_CONNECTIONS_STATE_STATUSES.CLOSED,
    PEER_CONNECTIONS_STATE_STATUSES.DISCONNECTED
]
