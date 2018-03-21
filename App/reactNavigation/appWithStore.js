import React, { Component } from 'react'

import thunkMiddleware from 'redux-thunk'

import {
  addNavigationHelpers,
} from 'react-navigation'

import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux'

import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'

import { Provider, connect } from 'react-redux'

import AppNavigator from './appNavigation'
import appReducer from '../redux/reducers'

// Note: must be run before createReduxBoundAddListener
// this is needed so that any events that mutate the navigation state
// properly trigger the event listeners
const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
)
/*
  Subscribe to updates to navigation lifecycle
  willBlur - the screen will be unfocused
  willFocus - the screen will focus
  didFocus - the screen focused (if there was a transition, the transition completed)
  didBlur - the screen unfocused (if there was a transition, the transition completed)
  https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/js/SimpleStack.js#L119
*/
const addListener = createReduxBoundAddListener("root")

class App extends Component {
  render() {
    return (
      <AppNavigator navigation={
        addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
          addListener
        })
      } />
    );
  }
}

const AppWithNavigationState = connect(
  state => ({ nav: state.nav })
)(App)

const store = createStore(
  appReducer,
  applyMiddleware(middleware, thunkMiddleware),
)

class RootApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default RootApp