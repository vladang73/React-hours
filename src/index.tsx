import React from 'react'
import ReactDOM from 'react-dom'
import App from 'App/App'
import reportWebVitals from './reportWebVitals'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SnackbarProvider } from 'notistack'
import { HelmetProvider } from 'react-helmet-async'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider as ReduxProvider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { store } from './App/store'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import translationEN from './Translatetion/en.json'
import translationNL from './Translatetion/nl.json'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './Styles/bootstrap.min.css'
import './Styles/style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

let persistor = persistStore(store)

i18n.use(LanguageDetector).init({
  lng: localStorage.getItem('i18n-friese-poort') || 'nl',
  resources: {
    en: translationEN,
    nl: translationNL,
  },
  debug: false,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                maxSnack={3}
              >
                <App />
              </SnackbarProvider>
            </I18nextProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
