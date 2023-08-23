import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NativeBaseProvider } from "native-base";

import { App } from "./App";
import { Gatherings } from "./Gatherings";
import { Gathering } from "./Gathering";
import { Occurrence } from "./Occurrence";
import { WeeklyReport } from "./WeeklyReport";
import { I18nApp } from "./i18n";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const env = process.env.REACT_APP_DATA_SET || "development";

export const client = new ApolloClient({
  uri: `https://5wmwst53.api.sanity.io/v1/graphql/${env}/default`,
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:org",
    element: <Gatherings />,
  },
  {
    path: "/:org/gatherings",
    element: <Gatherings />,
  },
  {
    path: "/organization/:org/gatherings",
    element: <Gatherings />,
  },
  {
    path: "/:org/gatherings/:slug",
    element: <Gathering />,
  },
  {
    path: "/organization/:org/gatherings/:slug",
    element: <Gathering />,
  },
  {
    path: "/:org/gatherings/:slug/:date",
    element: <Occurrence />,
  },
  {
    path: "/organization/:org/gatherings/:slug/:date",
    element: <Occurrence />,
  },
  {
    path: "/:org/gatherings/:slug/:date/:action",
    element: <Occurrence />,
  },
  {
    path: "/organization/:org/gatherings/:slug/:date/:action",
    element: <Occurrence />,
  },
  {
    path: "/:org/weekly-report",
    element: <WeeklyReport />,
  },
]);

const rootEl = document.getElementById("root");
const root = createRoot(rootEl!);
root.render(
  <StrictMode>
    <ApolloProvider {...{ client }}>
      <I18nApp>
        <NativeBaseProvider>
          <RouterProvider {...{ router }} />
        </NativeBaseProvider>
      </I18nApp>
    </ApolloProvider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
