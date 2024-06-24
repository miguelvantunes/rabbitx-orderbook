import OrderBook from './components/OrderBook';
import { useWebsocket } from './customHooks/useWebsocket';

function App() {
  const wsContext = useWebsocket();

  return (
    <main className="bg-slate-100 p-20 min-h-screen">
      <div
        className={`order-books flex flex-wrap justify-center gap-10 ${
          !wsContext.isConnected ? 'h-screen items-center -m-20' : ''
        } `}
      >
        {!wsContext.isConnected && (
          <div className="text-4xl ">Where's your internet?</div>
        )}
        {wsContext.isConnected && (
          <>
            <OrderBook marketId="BTC-USD"></OrderBook>
            <OrderBook marketId="SOL-USD"></OrderBook>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
