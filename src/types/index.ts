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
