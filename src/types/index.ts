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

export type WrapdactylParams = {
    url: string;
    options?: {
        userAgent?: string;
        timeout?: number;
    };
} & tokens;

export type WrapdactylConfig = {
    url: string;
} & tokens;

export type WrapdactylOptions = {
    url: string;
    userAgent: string;
    timeout: number;
};

export type WrapdactylRequest =
    | string
    | {
          url: string;
          method?: string;
          timeout?: number;
          headers?: AxiosRequestConfig["headers"];
          body?: any;
      };
