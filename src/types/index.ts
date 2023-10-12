import type { AxiosRequestConfig } from "axios";

type tokens =
    | {
          client: string;
          application?: string;
      }
    | {
          client?: string;
          application: string;
      };

export type WrapdactylConfig = {
    url: string;
} & tokens;

export type WrapdactylParams = {
    url: string;
    options?: {
        userAgent?: string;
        timeout?: number;
        cache?: boolean;
    };
} & tokens;

export type WrapdactylOptions = {
    url: string;
    userAgent: string;
    timeout: number;
    cache: boolean;
};

export type WrapdactylRequest =
    | string
    | {
          url: string;
          method?: string;
          timeout?: number;
          headers?: AxiosRequestConfig["headers"];
          data?: any;
      };

export interface serverWebsocketManagerEvents {
    connect: () => any;
    authentication: () => any;
    error: (data: Error) => any;
    disconnect: () => any;
    tokenExpiring: () => any;
    tokenExpired: () => any;
    daemonMessage: (message: string) => any;
    installMessage: (message: string) => any;
    installStarted: () => any;
    installCompleted: () => any;
    console: (message: string) => any;
    status: (message: string) => any;
    stats: (data: {
        cpu_absolute: number;
        disk_bytes: number;
        memory_bytes: number;
        memory_limit_bytes: number;
        network: { rx_bytes: number; tx_bytes: number };
        state: string;
        uptime: number;
    }) => any;
    backupRestoreCompleted: () => any;
    backupCompleted: () => any;
    transferLogs: (message: string) => any;
    transferStatus: (data: string) => any;
    deleted: () => any;
    daemonError: (message: string) => any;
}
