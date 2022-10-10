# ⚠️ Project in progress... ⚠️

# 🐦 Wrapdactyl
Do you know that moment when your scripts are very messy and full of api calls to your **pterodactyl panel**? No need to worry anymore, wrapdactyl is here. Wrapdactyl is a pterodactyl wrapper that allows you to make API calls by running simple functions.

# 📥 Installation
```
npm install wrapdactyl
```

# 🔧 How to use
Wrapdactyl is a class that required parameters such as the panel url, client api key or application api key or both. It can also be customised by setting some options to add or remove functions to make your code as efficient as possible.

```js
const wrapdactyl = require('wrapdactyl');

const ptero = new wrapdactyl({
    url: 'https://panel.domain.com', // Panel url / link
    client: 'ptlc_...',              // Client api key
    application: 'ptla_...',         // Application api key
    options: {                // Options to optimise the performance
        timeout: 5000,        // Timeout for a request
        cache: true,          // Enable or disable cache
        cacheUpdate: 30000,   // Update cache in a interval of time
    }
})
```

# 💻 How cache works
*⚠️Warning: This function spams your panel api*  
Cache is a hardware or software component that stores data so that future requests for that data can be served faster. Cahe can be updated and stored by running the function `updateCache` which makes multiple requests to your panel to get information about your users, servers, nodes, locations and nests. The option `option.cacheUpdate` helpes cache by updating every amount of time set.