import { useContext } from 'react';
import { WebsocketContext } from '../contexts/WebsocketContext';

export const useWebsocket = () => {
  return useContext(WebsocketContext);
};
