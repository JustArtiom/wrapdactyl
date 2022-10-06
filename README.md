# ⚠️ Project in progress... ⚠️

# 🐦 Wrapdactyl
Do you know that moment when your scripts are very messy and full of api calls to your pterodactyl panel? Well this is not a problem anymore because wrapdactyl is here. Wrapdactyl is a pterodactyl wrapper which allows you to make api calls by running simple functions. [More info about options here](https://github.com/JustArtiom/wrapdactyl#%EF%B8%8F-options)

# 📥 Installation
```
npm install wrapdactyl
```

# 🔧 How to use
Wrapdactyl is a class that requires some parameters in such as panel url client api key and application api key. It could also be customised by setting some options in order to add or remove functions to make your code maximum optimised.
```js
const wrapdactyl = require('wrapdactyl');

const ptero = new wrapdactyl({
    url: 'https://panel.domain.com',    // Panel url
    client: 'ptlc_...',                 // Client api key
    application: 'ptla_...',            // Application api key
    options: {                      // Options to optimise the performance
        cache: true,                // Enable or disable cache
        events: true,               // Enable of disable events
        checkInterval: 5000,        // An interval which checks the status of tokens and panel
        updateCacheInterval: 30000  // An interval which updates cache in case you have it enabled
    }
})
```
Even if you did the configuration the pterowrapper is not ready to use yet because it has to go trough a check which can be made by calling the async function `check()` which returns a promise with the status and ping of the pterodactyl panel and the status of the configured api keys.
```js
ptero.check().then(data => {
    console.log('pterodactyl wrapper is ready');
    console.log(data)
})
```
The option `checkInterval` offers you the opotunity to check the configuration in an interval of time  
Now the wrapper is ready to use! have fun with it 👍

# 💻 How cache works
*⚠️Warning: This function spams your panel api*  
Cache is a hardware or software component that stores data so that future requests for that data can be served faster. In this case cache can be used only if the option cache is enabled (`cache: true`). Cache can be stored at the begging of the code by running the `updateCache()` async function which returns boolean that tells if the cache process is complete or not.

```js
ptero.updateCache().then(() => {
    console.log('cache has been updated')
    
    // Now you have access to
    ptero.users.cache.get('user id');
    ptero.servers.cache.get('server id');
})
```
Cache isnt always up to date since you can make modifications manually to the servers and/or users, so thats why there is an option called `updateCacheInterval` which can be set in miliseconds to update the cache in an interval of time.  

# 📅 How events work
Events are actions or occurrences that happen in the system you are programming, which the system tells you about so your code can react to them. To listen to an wrapdactyl event you will have enable `events` in options and run the function `on()` which will take a string as first value, beeing the event name and a callback.
```js
ptero.on('Event Name', (data) => console.log(data));
```
Event Name | Callback input | Description
--- | --- | ----
checkUpdate | 1 value | This event runs only when `checkInterval` is configured. It calles the callback when the interval makes a check and returns the status and ping of the panel aswell and the api keys status
cacheUpdate | null | This events runs only when `updateCacheInterval` is configured, and it runs when the interval of time set updates the cache.  

**Example:**
```js
ptero.on('checkUpdate', (data) => {
    console.log('A check has been made!')
    console.log(data)
});
```

# 📕 Functions

# ⚠️ To-Do List

**For client api key:** 
```js
✅ ptero.client.permissions()
```
```js
✅ ptero.client.account.fetch()
⏩ ptero.client.account.twofa.fetch()
⏩ ptero.client.account.twofa.enable('code')
⏩ ptero.client.account.twofa.disable('password')
✅ ptero.client.account.updateEmail('newemail@gmail.com', 'password')
✅ ptero.client.account.updatePassword('currentpassword', 'newpassword')
✅ ptero.client.account.apikeys.fetch()
✅ ptero.client.account.apikeys.create('description', ['127.0.0.1'])
✅ ptero.client.account.apikeys.delete('apikey')
```
```js
ptero.client.servers.fetchAll()
ptero.client.servers.fetch('server id')
ptero.client.servers.console.fetch('server id')
new ptero.client.servers.console.ws( ptero.client.servers.console.fetch('server id') )
ptero.client.servers.resources.fetch('server id')
ptero.client.servers.sendCommand('server id', 'command')
ptero.client.servers.power('server id', 'start/stop/restart/kill')

// ⏩ a lot more about client servers here, that im gonna temporarily skip

ptero.client.servers.rename('server id', 'name')
ptero.client.servers.reinstall('server id')
```
**For application api key:**


# ⚙️ Options
soon
