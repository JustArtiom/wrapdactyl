# ⚠️ Project in progress... ⚠️

# 🐦 Wrapdactyl
Do you know that moment when your scripts are very messy and full of api calls to your **pterodactyl panel**? No need to worry anymore, wrapdactyl is here. Wrapdactyl is a pterodactyl wrapper that allows you to make API calls by running simple functions.

# 📥 Installation
```
npm install wrapdactyl
```

# 🔧 How to use
Wrapdactyl is a class that required parameters such as the panel url, client API key or application API key or both. It can also be customised by setting some options to add or remove functions to make your code as efficient as possible.

```js
const wrapdactyl = require('wrapdactyl');

const ptero = new wrapdactyl({
    url: 'https://panel.domain.com', // Panel URL / link
    client: 'ptlc_...',              // Client API key
    application: 'ptla_...',         // Application API key
    options: {
        timeout: 5000,
        cache: {
            autoupdate: 30000,
            servers: true,          
            users: true,
            nodes: true,
            locations: true,
            nests: true
        }
    }
})
```
The url parameter is required which is a string of the panel URL or ip address starting with http or https depending if you use ssl or not. The client and application parameters are not required but at least one must be configured.

# ⚙️ Options
Options are for advanced people who want to have extra functions or modified ones. Here are some explanations of what options wrapdactyl offers:  
Option | Validation | Description
--- | --- | ---
**Timeout** | false or >5000 | This is the timeout for any request you make.
**Cache** | false or object | to set some settings. It also __requires application__ token to be configured. Warning, cache setting spams your panel api, so enable only the cache parameters which you are goint to use in your script. Here are settings parameters for cache:   cache parameter | Validation | Description
--- | --- | --- 
autoupdate | false or >30000 | Updates the cache in an interval of time set
users | true or false | Stores information about users in cache
servers | true or false | Stores information about servers in cache
nodes | true or false | Stores information about nodes in cache
locations | true or false | Stores information about locations in cache
nests | true or false | Stores information about nests in cache