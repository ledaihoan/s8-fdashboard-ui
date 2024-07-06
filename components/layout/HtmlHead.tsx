import Head from "next/head";
import React from "react";

export default function HtmlHead() {
  return (
    <Head>
      <title>Silver8 Finance Dashboard</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
      />
      <link rel="shortcut icon" href="/favicon.png" />
    </Head>
  );
};