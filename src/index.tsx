import React from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import App from 'App'
import reportWebVitals from 'reportWebVitals'
import { Provider } from 'react-redux'
import store from 'store'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Inter',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1148,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#6D5BD0',
      light: '#F4F2FF',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#F2F0F9',
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
