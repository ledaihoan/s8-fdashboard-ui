import "@mantine/core/styles.css";
import {MantineProvider} from "@mantine/core";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { theme } from "../theme";
import React from "react";
import HtmlHead from "../components/layout/HtmlHead";
import BaseBodyLayout from "../components/layout/Body/BaseBodyLayout";

export default function App({ Component, pageProps }: any) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <MantineProvider theme={theme}>
          <HtmlHead/>
          <BaseBodyLayout Component={Component} pageProps={pageProps} />
        </MantineProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
