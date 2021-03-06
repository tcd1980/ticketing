
import 'bootstrap/dist/css/bootstrap.css';
import 'react-phone-number-input/style.css'
import './overrides.css'
import './sidebar.css'
import './floating-label.css'

import React from 'react';
import { ThemeProvider } from 'styled-components'
import { buildClient } from '../api/build-client';
import Header from './_header';
import { Notification, Footer } from '../components';

const theme = {
  colors: {
    primary: '#0070f3',
  },
}


// TODO: translate routes
// See https://stackoverflow.com/questions/56426126/how-do-i-localize-routes-with-next-js-and-next-i18next
class AppComponent extends React.Component<any, any> {

  static async getInitialProps(appContext) {
    const client = buildClient(appContext.ctx);

    const { data: currentUser } = await client.get('/api/users/currentuser');
    const { data: cart } = await client.get('/api/cart');


    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component
        .getInitialProps(appContext.ctx, client, currentUser, cart)
    }

    return {
      pageProps,
      ...currentUser
    };
  }

  render() {
    const { Component, pageProps, currentUser } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Header currentUser={currentUser} {...pageProps} />
        <Notification />
        <Component currentUser={currentUser} {...pageProps} />
        <Footer />
      </ThemeProvider>
    )
  }
}

export default AppComponent;