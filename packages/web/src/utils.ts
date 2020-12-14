export const SERVER_IP = process.env.REACT_APP_SERVER_IP

export const isDev = process.env.NODE_ENV === 'development'

export const isProd = process.env.NODE_ENV === 'production'

export const SERVER_WS_URI = `${isProd ? 'wss' : 'ws'}://${SERVER_IP}`