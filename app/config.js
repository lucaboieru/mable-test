"use strict";

let config = module.exports;

config.controllers = {
    products: require(__dirname + '/controllers/products'),
    orders: require(__dirname + '/controllers/orders'),
    users: require(__dirname + '/controllers/users')
};

config.routes = [
    {
        url: '/products',
        methods: {
            'post': {
                operation: config.controllers.products.create,
                permission: ['manager']
            },
            'get': {
                operation: config.controllers.products.index,
                permission: []
            }
        }
    },
    {
        url: '/orders',
        methods: {
            'post': {
                operation: config.controllers.orders.create,
                permission: ['manager']
            },
            'get': {
                operation: config.controllers.orders.index,
                permission: []
            }
        }
    },
    {
        url: '/products/:pid',
        methods: {
            'get': {
                operation: config.controllers.products.show,
                permission: []
            },
            'put': {
                operation: config.controllers.products.update,
                permission: ['manager']
            },
            'delete': {
                operation: config.controllers.products.remove,
                permission: ['manager']
            }
        }
    },
    {
        url: '/login',
        methods: {
            'post': {
                operation: config.controllers.users.login,
                permission: []
            }
        },
    },
    {
        url: '/logout',
        methods: {
            'post': {
                operation: config.controllers.users.logout,
                permission: ['manager']
            }
        }
    }
];

config.secret = "R@$T),aecm3r0-5ynFWRGK)@!#<pasf84k0mx1-3o9";