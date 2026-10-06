import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, mode) => {},
  closeBuyWindow: () => {},
  holdings: [],
  addHolding: (holding) => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedMode, setSelectedMode] = useState("BUY");
  const [holdings, setHoldings] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to open the Buy/Sell Window
  const handleOpenBuyWindow = (uid, mode = "BUY") => {
    setSelectedStockUID(uid);
    setSelectedMode(mode || "BUY");
    setIsBuyWindowOpen(true);
  };

  // Function to close the Buy Window
  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedMode("BUY");
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleAddHolding = (holding) => {
    setHoldings((prevHoldings) => [...prevHoldings, holding]);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        holdings: holdings,
        addHolding: handleAddHolding,
        refreshKey: refreshKey,
        triggerRefresh: triggerRefresh,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          mode={selectedMode}
          onOrderPlaced={triggerRefresh}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
