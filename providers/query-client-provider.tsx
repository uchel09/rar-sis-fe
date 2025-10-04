"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useState } from "react";
import NextTopLoader from "nextjs-toploader";
import { ConfigProvider, message, notification, Modal } from "antd";

interface AppMessageContextProps {
  messageApi: typeof message;
  notificationApi: typeof notification;
  modalApi: typeof Modal;
}

const AppMessageContext = createContext<AppMessageContextProps | undefined>(
  undefined
);

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

  return (
    <AppMessageContext.Provider
      value={{ messageApi, notificationApi, modalApi }}
    >
      <QueryClientProvider client={queryClient}>
        {messageContextHolder}
        {notificationContextHolder}
        {modalContextHolder}

        <NextTopLoader
          color="#1890ff"
          initialPosition={0.3}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1677ff",
            },
          }}
        >
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </AppMessageContext.Provider>
  );
}

// Custom hook supaya gampang pakai
export function useAppMessage() {
  const context = useContext(AppMessageContext);
  if (!context)
    throw new Error("useAppMessage must be used inside AppProvider");
  return context;
}
