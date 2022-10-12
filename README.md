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
        cache: true
    }
})
```
The url parameter is required which is a string of the panel URL or ip address starting with http or https depending if you use ssl or not. The client and application parameters are not required but at least one must be configured.

# ⚙️ Options
Options are for advanced people who want to have extra functions or modified ones. Here are some explanations of what options wrapdactyl offers:  
| Option        | Validation      | Description
| ------------- | --------------- | ---
| Timeout       | false or >=5000  | This is the timeout for any request you make.
| Cache         | true or false   | Cache is a hardware or software component that stores data so that future requests for that data can be served faster.

# 💻 How Cache Works
Cache is a hardware or software component that stores data so that future requests for that data can be served faster. There are many cache values in this wrapper, to update it you will need to have cache option enabledd and call the function `fetchAll` which will go trough all pages of the value selected and update the cache from its object. Here is an example
```js
ptero.users.cache.get(1) 
// returns undefined

ptero.users.fetchAll().then(() => {
    console.log('Users cache has been updated')
    ptero.users.cache.get(1) // returns data about user id chosen.
})
```
Cache its beeing updated when using the wrapper only... it doesnt update when you manually make modifications directly from admin panel. 