import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/lib/env";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: env.NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
