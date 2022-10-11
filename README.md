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
            clientservers: true, 
            servers: true,          
            users: true,
            nodes: true,
            locations: true,
            nests: true
        }
    }
})
```
If you dont want to get too complicated, and just want access to the most of the functions you canconfigure url, client and application key. 

# ⚙️ Options