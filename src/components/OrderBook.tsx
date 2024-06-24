import {
  PublicationContext,
  SubscribedContext,
  Subscription,
} from 'centrifuge';
import { useEffect, useState } from 'react';
import {
  IOrderBookData,
  PriceQuantityPair,
} from '../interfaces/IOrderBookData';
import { useWebsocket } from '../customHooks/useWebsocket';
import Trades from './Trades';

interface Props {
  marketId: string;
}

type setFType = React.Dispatch<React.SetStateAction<Map<number, string>>>;

const LIMIT_SHOWN_ENTRIES = 11;
const ANIMATED_BIDS_EVERY_MS = 500;

const OrderBook = ({ marketId }: Props) => {
  const wsContext = useWebsocket();
  const [bids, setBids] = useState(new Map<number, string>());
  const [asks, setAsks] = useState(new Map<number, string>());
  const [animatedItems, setAnimatedItems] = useState(new Set<number>());

  useEffect(() => {
    if (!wsContext.websocket) {
      return;
    }
    const websocket = wsContext.websocket;
    let sub: Subscription | null;
    let currentSequence = 0;
    let isAnimating = false;

    const animateItems = (
      bids: PriceQuantityPair[] = [],
      asks: PriceQuantityPair[] = []
    ) => {
      return new Promise<void>((resolve) => {
        const newAnimatedBids = new Set<number>();

        bids.forEach((bid) => {
          const price = parseFloat(bid[0]);
          newAnimatedBids.add(price);
        });

        asks.forEach((bid) => {
          const price = parseFloat(bid[0]);
          newAnimatedBids.add(price);
        });

        setAnimatedItems(newAnimatedBids);

        setTimeout(() => {
          setAnimatedItems(new Set<number>());
          resolve();
        }, ANIMATED_BIDS_EVERY_MS);
      });
    };

    const updateData = (bids: PriceQuantityPair[], setFunction: setFType) => {
      return new Promise<void>((resolve) => {
        setFunction((prevData) => {
          const newData = new Map(prevData);

          if (bids) {
            bids.forEach((bid) => {
              const price = parseFloat(bid[0]);

              if (bid[1] === '0') {
                if (newData.has(price)) {
                  newData.delete(price);
                }
              } else {
                newData.set(price, bid[1]);
              }
            });
          }

          const allData = new Map(
            [...newData.entries()].sort((a, b) => b[0] - a[0])
          );

          return allData;
        });

        resolve();
      });
    };

    const handleSubscription = async (
      ctx: SubscribedContext | PublicationContext
    ) => {
      if (isAnimating) {
        return;
      }

      if (ctx.data) {
        const data: IOrderBookData = ctx.data;

        if (currentSequence < data.sequence) {
          currentSequence = data.sequence;
          console.log(`New Data on orderbook:${marketId}`, ctx);

          if (data.bids?.length) {
            await updateData(data.bids, setBids);
          }

          if (data.asks?.length) {
            await updateData(data.asks, setAsks);
          }

          isAnimating = true;
          await animateItems(data.bids, data.asks);
          isAnimating = false;
        }
      }
    };

    sub = websocket.getSubscription(`orderbook:${marketId}`);
    if (!sub) {
      sub = websocket.newSubscription(`orderbook:${marketId}`);
    }

    sub.on('subscribed', handleSubscription);
    sub.on('publication', handleSubscription);
    sub.subscribe();

    return () => {
      if (!websocket) {
        return;
      }

      sub.unsubscribe();
    };
  }, [wsContext, marketId]);

  return (
    <>
      <div className="w-96 flex flex-col p-3 bg-white shadow-lg">
        <h2 className="font-extrabold text-lg text-center">
          Market: {marketId}
        </h2>
        <div className="flex flex-col gap-10 mt-2">
          <Trades
            title="Asks"
            data={asks}
            animatedData={animatedItems}
            colorClass="red"
            limit={LIMIT_SHOWN_ENTRIES}
          />
          <Trades
            title="Bids"
            data={bids}
            animatedData={animatedItems}
            colorClass="green"
            limit={LIMIT_SHOWN_ENTRIES}
          />
        </div>
      </div>
    </>
  );
};

export default OrderBook;
