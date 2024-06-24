# RabbitX Take Home

This is the repo for the RabbitX take-home exercise.

To install and run the project, follow the next steps:
- Install dependencies by running: **npm install**
- Copy **.env.example** file and rename the copy to **.env**
- **Set the variables** to the ones shared on the **rabbitx-test-assignment-web.pdf** file
  - **VITE_RABBIT_TEST_WS: [insert your test ws here]**
  - **VITE_RABBIT_TEST_JWT: [insert your test jwt key here]**
  - **VITE_RABBIT_PROD_WS: [insert your prod ws key here]**
  - **VITE_RABBIT_PROD_JWT: [insert your prod jwt key here]**

- Run the project by running: **npm run dev**



## Brief Project Explanation

### contexts folder
**WebsocketContext.tsx**:> Creates a context to initiate and manage the WebSocket connection. The **WebsocketProvider** lives under this file. It connects to the WebSocket server and uses a custom hook useHasNetworkSignal to handle situations where the user loses connection. 

### customHooks folder
**useHasNetworkSignal.tsx**:> It detects if a user loses the internet connection.
**useWebsocket.tsx**:> An easy way to get the WebsocketContext.

### components folder
**OrderBook.tsx**:> The core file. Responsible for orchestrating bids and asks by subscribing to a channel using the **useWebsocket** context. It also handles which items should be animated. Uses the **Trades** component to display the obtained data.

**Trades.tsx**:> A dynamic component that might get Bids or Asks and displays the data.

### interfaces folder
**IOrderBookData.ts**:> A group of types and an interface. **IOrderBookData** represents the data obtained from the WebSocket call.

### App.tsx file
Defines the `<main>...</main>` structure and uses **OrderBook** component. Displays an error message if the user has lost internet access by obtaining that information from the **useWebsocket** Context.

### main.tsx
Encapsulates the App inside a **WebsocketProvider** giving access to the **WebsocketContext**.
