import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { NativeBaseProvider } from 'native-base'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from './App'
import { Gathering } from './Gathering'
import { Gatherings } from './Gatherings'
import { I18nApp } from './i18n'
import { Occurrence } from './Occurrence'
import { reportWebVitals } from './reportWebVitals'
import { WeeklyReport } from './WeeklyReport'
import './index.css'

const env = process.env.REACT_APP_DATA_SET || 'development'

export const client = new ApolloClient({
  uri: `https://5wmwst53.api.sanity.io/v1/graphql/${env}/default`,
  cache: new InMemoryCache(),
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/:org',
    element: <Gatherings />,
  },
  {
    path: '/:org/gatherings',
    element: <Gatherings />,
  },
  {
    path: '/organization/:org/gatherings',
    element: <Gatherings />,
  },
  {
    path: '/:org/gatherings/:slug',
    element: <Gathering />,
  },
  {
    path: '/organization/:org/gatherings/:slug',
    element: <Gathering />,
  },
  {
    path: '/:org/gatherings/:slug/:date',
    element: <Occurrence />,
  },
  {
    path: '/organization/:org/gatherings/:slug/:date',
    element: <Occurrence />,
  },
  {
    path: '/:org/gatherings/:slug/:date/:action',
    element: <Occurrence />,
  },
  {
    path: '/organization/:org/gatherings/:slug/:date/:action',
    element: <Occurrence />,
  },
  {
    path: '/:org/weekly-report',
    element: <WeeklyReport />,
  },
  {
    path: '/:org/weekly-report/:startDate',
    element: <WeeklyReport />,
  },
])

const rootEl = document.getElementById('root') || document.createElement('div')
const root = createRoot(rootEl)
root.render(
  <StrictMode>
    <ApolloProvider {...{ client }}>
      <I18nApp>
        <NativeBaseProvider>
          <RouterProvider {...{ router }} />
        </NativeBaseProvider>
      </I18nApp>
    </ApolloProvider>
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
