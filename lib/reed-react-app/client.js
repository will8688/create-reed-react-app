import React from 'react';
import {render} from 'react-dom';

import BrowserRouter from 'react-router-dom/BrowserRouter';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import routes from './routes.js';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducers from '../utils/reducers/index.js';

import XOREncode from '../utils/encode/xor';
import Base64Encode from '../utils/encode/base64';

import config from '../utils/config';

window.INITIAL_STATE = window.INITIAL_STATE || '{}';

const AppRouter = () => {
    let key = config.key || '4ppl3t-x0r-s3cur1ty-k3y';
    let xor = new XOREncode(key);
    let base64 = new Base64Encode();
    let state = config.state === 'plain' ? JSON.parse(window.INITIAL_STATE) : JSON.parse(xor.decode(base64.decode(window.INITIAL_STATE)));

    let store = createStore(reducers, state, applyMiddleware(thunk));

    let renderedRoutes = routes.map(function(route, i) {
        return React.createElement(Route, {
            key: route.key || i,
            path: route.path,
            exact: route.exact,
            strict: route.strict,
            render: function renderRoute(props) {
                return React.createElement(route.component, Object.assign({}, props, route.props, props.match ? props.match.params : {}, {route: route}));
            }
        });
    });

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    {renderedRoutes}
                </Switch>
            </BrowserRouter>
        </Provider>
    );
};

render(<AppRouter />, document.getElementById('candidateProfileHeader'));
