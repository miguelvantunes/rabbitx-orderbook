import { Centrifuge } from 'centrifuge';
import { createContext, useEffect, useRef, useState, ReactNode } from 'react';
import useHasNetworkSignal from '../customHooks/useHasNetworkSignal';

export interface IWebsocketContext {
  isConnected: boolean;
  websocket: Centrifuge | undefined;
}

export const WebsocketContext = createContext<IWebsocketContext>({
  isConnected: false,
  websocket: undefined,
});

interface WebsocketProviderProps {
  children: ReactNode;
}
export const WebsocketProvider = ({ children }: WebsocketProviderProps) => {
  const hasNetworkSignal = useHasNetworkSignal();
  const [isConnected, setIsConnected] = useState(false);
  const websocket = useRef<Centrifuge | undefined>(undefined);

  useEffect(() => {
    // const centrifuge = new Centrifuge(import.meta.env.VITE_RABBIT_TEST_WS, {
    //   token: import.meta.env.VITE_RABBIT_TEST_JWT,
    // });

    const centrifuge = new Centrifuge(import.meta.env.VITE_RABBIT_PROD_WS, {
      token: import.meta.env.VITE_RABBIT_PROD_JWT,
    });

    centrifuge.on('connected', () => {
      setIsConnected(true);
    });

    centrifuge.on('disconnected', () => {
      setIsConnected(false);
    });

    centrifuge.connect();

    websocket.current = centrifuge;

    return () => {
      centrifuge.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hasNetworkSignal) {
      websocket.current?.connect();
      setIsConnected(true);
    } else {
      websocket.current?.disconnect();
      setIsConnected(false);
    }
  }, [hasNetworkSignal]);

  const v = {
    isConnected,
    websocket: websocket.current,
  };
  return (
    <WebsocketContext.Provider value={v}>{children}</WebsocketContext.Provider>
  );
};
