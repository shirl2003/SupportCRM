import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext({ isOpen: false, toggle: () => {}, close: () => {} });
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{
      isOpen,
      toggle: () => setIsOpen((prev) => !prev),
      close: () => setIsOpen(false),
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
