import express from 'express';
import handlebars from 'express-handlebars';
import request from 'request';
import path from 'path';

import React from 'react';
import {renderToString} from 'react-dom/server';

import StaticRouter from 'react-router-dom/StaticRouter';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import {matchRoutes} from 'react-router-config';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import routes from './routes.js';

import reducers from '../utils/reducers/index.js';

import XOREncode from '../utils/encode/xor';
import Base64Encode from '../utils/encode/base64';

import config from '../utils/config';

var fs      = require('fs');
var app     = express();
var router  = express.Router();

app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './app/views');

router.get('*', (req, res) => {
    let store = createStore(reducers, applyMiddleware(thunk));
    let branch = matchRoutes(routes, req.url);
    let promises = [];

    for ( let x = 0; x < branch.length; x++ ) {
        let component = branch[x].route.component;
        if ( component.fetchData instanceof Function ) {
            promises.push(component.fetchData(store));
        }
    }

    Promise.all(promises).then((data) => {
        console.log(req.url);

        let context = {};

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

        let content = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={context}>
                    <Switch>
                        {renderedRoutes}
                    </Switch>
                </StaticRouter>
            </Provider>
        );
        
		let key = config.key || '4ppl3t-x0r-s3cur1ty-k3y';
		let xor = new XOREncode(key);
		let base64 = new Base64Encode();
    
		let params = {
			content: content,
			style: fs.existsSync(path.resolve('./app/compiled/styles/invitetoapply.css')) ? '/styles/invitetoapply.css' : null,
			script: fs.existsSync(path.resolve('./app/compiled/scripts/invitetoapply.js')) ? '/scripts/invitetoapply.js' : null,
			state: config.state === 'plain' ? JSON.stringify(store.getState()) : base64.encode(xor.encode(JSON.stringify(store.getState())))
		};
		   
        res.render('index', params);
    }).catch((err) => {
        console.error(err);
    });
});

app.use(express.static( './app/compiled'));
app.use('/', router);
app.listen(config.port);
console.log(config.environment + ' server listening on http://localhost:' + config.port);

module.exports = app;
