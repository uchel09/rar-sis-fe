"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import { message, notification, Modal, ConfigProvider } from "antd";
import NextTopLoader from "nextjs-toploader";
import { DataInitializerProvider } from "@/providers/data-initializer-provider";

// =============================
// 🔔 Context Setup
// =============================
interface AppMessageContextProps {
  messageApi: typeof message;
  notificationApi: typeof notification;
  modalApi: typeof Modal;
}

const AppMessageContext = createContext<AppMessageContextProps | undefined>(
  undefined
);

// =============================
// 🧩 Custom Persister (Recommended way in v5)
// =============================
function createLocalStoragePersister(): Persister {
  return {
    persistClient: async (client) => {
      localStorage.setItem("tanstack-cache", JSON.stringify(client));
    },
    restoreClient: async () => {
      const cache = localStorage.getItem("tanstack-cache");
      return cache ? JSON.parse(cache) : undefined;
    },
    removeClient: async () => {
      localStorage.removeItem("tanstack-cache");
    },
  };
}

// =============================
// 🧩 Main Provider
// =============================
export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: Infinity,
          },
        },
      })
  );

  const [persister, setPersister] = useState<Persister | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPersister(createLocalStoragePersister());
  }, []);

  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

  if (!persister) return null; // hindari SSR error

  return (
    <AppMessageContext.Provider
      value={{ messageApi, notificationApi, modalApi }}
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          buster: "v1.0.0",
          maxAge: 1000 * 60 * 60 * 24, // 1 hari
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              const key = query.queryKey?.[0];
              return (
                typeof key === "string" &&
                ["academicYearActive", "classes"].includes(key)
              );
            },
          },
        }}
      >
        {messageContextHolder}
        {notificationContextHolder}
        {modalContextHolder}

        <NextTopLoader
          color="#1677ff"
          crawlSpeed={200}
          height={3}
          showSpinner={false}
        />

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1677ff",
            },
          }}
        >
          <DataInitializerProvider />
          {children}
        </ConfigProvider>
      </PersistQueryClientProvider>
    </AppMessageContext.Provider>
  );
}

// =============================
// 🪄 Hook
// =============================
export function useAppMessage() {
  const context = useContext(AppMessageContext);
  if (!context)
    throw new Error("useAppMessage must be used inside AppProvider");
  return context;
}
