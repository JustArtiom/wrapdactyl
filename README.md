# ⚠️ Project in progress... ⚠️

**For client API key:**  
`ptero.client` - its half completed. not all functions available  

**For Application key:**  
`ptero.users` - completed  
`ptero.nodes`- completed  
`ptero.wings` - completed  
`ptero.locations` - completed  
`ptero.servers` - in development...  
`ptero.nests` - in development...  



# 🐦 Wrapdactyl
Do you know that moment when your scripts are very messy and full of api calls to your Pterodactyl panel? Well this is not a problem anymore because wrapdactyl is here. Wrapdactyl is a Pterodactyl wrapper which allows you to make api calls by running simple functions. [More info about options here](#%EF%B8%8F-options).

# 📥 Installation:
```
npm install wrapdactyl
```

# 🔧 How to Properly Use:
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
Now the wrapper is ready to use! have fun with it. 👍

# 💻 How Cache Works:
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

# 📅 How Events Work:
Events are actions or occurrences that happen in the system you are programming, which the system tells you about so your code can react to them. To listen to an wrapdactyl event you will have enable `events` in options and run the function `on()` which will take a string as first value, being the event name and a callback.
```js
ptero.on('Event Name', (data) => console.log(data));
```
Event Name | Callback input | Description
--- | --- | ----
checkUpdate | 1 value | This event runs only when `checkInterval` is configured. It runs the callback when the interval makes a check and returns the status and ping of the panel aswell and the api keys status
cacheUpdate | null | This events runs only when `updateCacheInterval` is configured, and it runs when the interval of time set updates the cache.  

**Example:**
```js
ptero.on('checkUpdate', (data) => {
    console.log('A check has been made!')
    console.log(data)
});
```
# 🐛 Catching Errors:
Every function can throw errors in case of bad configuration or the wrapper not being ready. 
After the async function is ran you can check if the funtion is complete or had an error by validating the variable "error"  

**Here is an example how i would catch errors using this wrapper:**
```js
// Example...
ptero.any_funtion()
.then(data => {
    if(data?.panelError) 
        console.log(`Panel responded with status ${data.status} and error message is:\n ${data.message.map(x => x.detail).join('\n')}`)
        /* 
        example of panel error: 
        {
            error: true,
            panelError: true,
            status: 404,
            message: [
                {
                code: 'NotFoundHttpException',
                status: '404',
                detail: 'The requested resource could not be found on the server.'
                }
            ]
        }
        */
    else if(data.error) {
        console.log(`Panel is probably offline`)
        /*
        Example of error:
        {
            error: true,
            message: AxiosError: connect ECONNREFUSED 0.0.0.0:00
            at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1195:16) {
                ...
            }
        }
        */
    }
})
.catch(err => {
    // Wrapdactyl errors could be:
    //   - Wrapdactyl not ready
    //   - Invalid configuration/not all required parameters

    console.error(err);

    /*
    Example or wrapdactyl error
    "Wrapdactyl - id of the node must be present"
    */
})
```



# 📕 Client Functions:

**Show permissions:**  
Retries all available permissions
```js
ptero.client.permissions()
```

**Account details:**  
Retrieves information about the account
```js
ptero.client.account.fetch()
```

**Update email:**  
Updates the password of the account  
- Value 1 - Required - the new email which you want to change into
- Value 2 - Required - password of the account
```js
ptero.client.account.updateEmail('newemail@gmail.com', 'password')
```

**Update password:**  
Updates the email address of the account  
- Value 1 - Required - The password of the account
- Value 2 - Required - The new password which you want to change into
```js
ptero.client.account.updatePassword('password', 'newpassword')
```

**Two-Factor Authentication details:**  
Generates a TOTP QR code image to allow the setup of 2FA
```js
ptero.client.account.twofa.fetch()
```

**Enable Two-Factor Authentication:**  
Enables TOTP 2FA using the QR code generated by the function above  
- Value 1 - Required - The password of the account
- Value 2 - Required - The 2fa code generated by Authenticator app
```js
ptero.client.account.twofa.enable('password', '2fa code')
```

**Disable Two-Factor Authentication:**  
Disables TOTP 2FA on the account  
- Value 1 - Required - Password of the account
```js
ptero.client.account.twofa.disable('password')
```

**Disable Two-Factor Authentication:**  
Disables TOTP 2FA on the account  
- Value 1 - Required - Password of the account
```js
ptero.client.account.twofa.disable('password')
```

**List API keys:**  
Retries a list of API keys  
```js
ptero.client.account.apikeys.fetch()
```

**Create API key:**  
Generates a new API key  
- Value 1 - Required - Name of the api key you want to generate
- Value 2 - Nullable - The white list ips
```js
ptero.client.account.apikeys.create('name', ['127.0.0.1'])
```

**Delete API key:**  
Deletes the specified API key
- Value 1 - Required - The api key identifier
```js
ptero.client.account.apikeys.delete('apikey')
```

**Server List:**  
List all your servers
```js
ptero.client.servers.fetchAll()
```

**Server details:**  
Retrieves information about the specified server
- Value 1 - Required - Server id
- Value 2 - Nullable - Options Object
    - egg - Information about the egg the server uses
    - subusers - List of subusers on the server
```js
ptero.client.servers.fetch('server id', { egg: true, subusers: true });
```

**Server Console details:**  
Generates credentials to establish a websocket
- Value 1 - Required - Server id
```js
ptero.client.servers.consoleDetails('server id')
```

**Server websocket:**  
Connect to the server websocket

- Value 1 - Required - Object - Details to establish the websocket  
      *These can be requested from `ptero.client.servers.consoleDetails`*
    - Origin - Required - The panel URL
    - Token - Required - The token for authentication
    - Socket - Required - The actual websocket destination

```js
let websocket_details = await ptero.client.servers.consoleDetails("server id");
let server = new ptero.client.servers.websocket(websocket_details);

// What you can listen to
server.on('connected', async () => {
    console.log('connected')

    // What you can send to the server
    server.power('start'); // start / restart / stop / kill
    server.send('command');
    server.request.logs();
    server.request.stats();
    
    // Close the websocket
    server.close()
});
server.on('status', (status) => console.log(status));
server.on('stats', (stats) => console.log(stats));
server.on('console', (message) => console.log(message));
server.on('deamonError', (message) => console.log(message));

server.on('expiring', (auth) => {
    console.log('Token is about to expire');
    // send a new token to keep the connection alive
    // A new token can be requested by running ptero.client.servers.consoleDetails
    auth("new token");
});
server.on('expired', () => console.log('Token had expired'));
server.on('disconnected', () => console.log('server disconnected'));

// Connect to the server
server.connect().catch(err => console.log(err));
```
The function `server.connect()` is an async function that returns "true" if connected and throws an error in case it couldnt connect to the websocket. **It is preferable to put this function at the bottom, before you listen to events if you are going to await the function** otherwise it wont triger the event "connected".  
**Here is an example how await connect function could help:**
```js
server.on('connected', () => console.log('Server connected'))

await server.connect();
server.power('start');
server.send('command');
server.request.logs();
server.request.stats();
```
**Server Resource usage:**  
Retrieves resource utilization of the specified server  
- Value 1 - Required - Server id
```js
ptero.client.servers.resources('server id')
```

**Send command to the server:**  
Sends a command to the server. The server must be online to send a command to it.
- Value 1 - Required - Server id
- Value 2 - Required - Command string
```js
ptero.client.servers.sendCommand('server id', 'command')
```

**Change server power state:**  
Sends a power signal to the server  
- Value 1 - Required - Server id
- Value 2 - Required - Can be only: start, restart, stop, kill
```js
ptero.client.servers.power('server id', 'start')
```
#
```
⏩ Skipped a lot of functions for the future versions.
```
#

**Rename server:**  
Renames the server  
- Value 1 - Required - Server id
- Value 2 - Required - New Name of the server
```js
ptero.client.servers.rename('server id', 'name')
```

**Reinstall server:**  
Reinstalls the server
- Value 1 - Required - Server id
```js
ptero.client.servers.reinstall('server id')
```

# 📙 Application Functions:

**List users:**  
Retrieves all users
- Value 1 - nullAble - Options object
    - servers - List of servers the user has access to
```js
ptero.users.fetchAll({servers: true})
```

**User details:**  
Retrieves the specified user
- Value 1 - Required - Number or string id of the user
- Value 2 - nullAble - Options Object
    - servers - List of servers the user has access to
```js
ptero.users.fetch(1, {servers: true})
``` 

**Create user:**  
Creates a new user
- Value 1 - Required - Configuration
    - username - Required - string
    - email - Required - string
    - first_name - Required - string
    - last_name - Required - string
    - password - nullable - string
    - root_admin - nullable - boolean
    - language - nullable - string
```js
ptero.users.create({
    username: 'username',
    email: 'email@mail.com',
    first_name: 'firstname',
    last_name: 'lastname',
    password: 'your_password',
    root_admin: false
})
```

**Update user:**  
Updates the user information
- Value 1 - Required - The id of the user
- Value 2 - Required - Options Object
    - username - Required - string
    - email - Required - string
    - first_name - Required - string
    - last_name - Required - string
    - password - nullable - string
    - root_admin - nullable - boolean
    - language - nullable - string
```js
ptero.users.update(2, {
    username: 'newusername',
    email: 'newemail@email.com',
    first_name: 'firstname',
    last_name: 'lastname',
    password: 'newPassword'
})
```

**Delete user:**  
Deletes the specified user
- Value 1 - Required - The id of the user you want to delte

```js
ptero.users.delete(2)
```

#

**List nodes:**  
Retrieves a list of all nodes
- Value 1 - nullable - Options Object 
    - allocations - List of allocations added to the node
    - location - Information about the location the node is assigned to
    - servers - List of servers on the node
```js
ptero.nodes.fetchAll({
    allocations: true, 
    location: true,
    servers: true
})
```

**Node details:**  
Retrieves the specified node
- Value 1 - Required - Node id
- Value 2 - nullable - Options Object 
    - allocations - List of allocations added to the node
    - location - Information about the location the node is assigned to
    - servers - List of servers on the node
```js
ptero.nodes.fetch(1, {
    allocations: true, 
    location: true,
    servers: true
})
```

**Node configuration:**  
Displays the Wings configuration
- Value 1 - Required - Node id
```js
ptero.nodes.configuration(1)
```

**Create node:**  
Creates a new node
- Value 1 - Required - Configuration
    - public - Nullable - Boolean
    - name - Required - String
    - description - Nullable - String
    - location_id - Required - Number
    - fqdn - Required - String
    - scheme - Required - String *(http/https)*
    - behind_proxy - Nullable - Boolean
    - maintenance_mode - Nullable - Boolean
    - memory - Required - Number
    - memory_overallocate - Required - Number
    - disk - Required - Number
    - disk_overallocate - Required - Number
    - upload_size - Nullable - Number
    - daemon_listen - Required - Number
    - deamon_sftp - Required - Number
```js
ptero.nodes.create({
    name: "New Node",
    location_id: 1,
    fqdn: "node1.domain.com",
    scheme: "https",
    memory: 10240,
    memory_overallocate: 0,
    disk: 50000,
    disk_overallocate: 0,
    upload_size: 100,
    daemon_sftp: 2022,
    daemon_listen: 8080
})
```

**Update node:**  
- Value 1 - Required - Node id
- Value 2 - Required - Configuration
    - public - Nullable - Boolean
    - name - Required - String
    - description - Nullable - String
    - location_id - Required - Number
    - fqdn - Required - String
    - scheme - Required - String *(http/https)*
    - behind_proxy - Nullable - Boolean
    - maintenance_mode - Nullable - Boolean
    - memory - Required - Number
    - memory_overallocate - Required - Number
    - disk - Required - Number
    - disk_overallocate - Required - Number
    - upload_size - Nullable - Number
    - daemon_listen - Required - Number
    - deamon_sftp - Required - Number
```js
ptero.nodes.update(1, {
    name: "Updated Node",
    location_id: 1,
    fqdn: "node.domain.com",
    scheme: "https",
    memory: 10240,
    memory_overallocate: 0,
    disk: 50000,
    disk_overallocate: 0,
    upload_size: 100,
    daemon_sftp: 2022,
    daemon_listen: 8080
})
```

**Delete node:**  
Deletes the specified node
- Value 1 - Required - Node id
```js
ptero.nodes.delete(1)
```

**Wings details:**  
Check wings status
- Value 1 - Required - Node id  

*⚠️ Warning: This is a beta function, it may have bugs, be slow or not work*
```js
ptero.wings(1)
```

**List allocations:**  
Lists allocations added to the node
- Value 1 - Required - Node id
- Value 2 - Nullable - Options Object
    - node - Information about the node the allocation belongs to
    - server - Information about the server the allocation belongs to
```js
ptero.nodes.allocations.fetchAll(1, {node: true, server: true})
```

**Create allocation:**  
Adds an allocation to the node
- Value 1 - Required - Node id
- Value 2 - Required - Configuration object
    - ip - Required - String - IP address for the allocations
    - ports - Required - Array with strings - Object containing the ports to add
```js
ptero.nodes.allocations.create(1, {
    ip: "0.0.0.0",
    ports: [
        "25565"
    ]
})
```

**Delete allocation:**  
Deletes the specified allocation  
- Value 1 - Required - Node id
- Value 2 - Required - Allocation id
```js
ptero.nodes.allocations.delete(1, 1)
```

#

**List locations:**  
Retrieves all locations
- Value 1 - Nullable - Options object
    - nodes - List of nodes assigned to the location
    - servers - List of servers in the location
```js
ptero.locations.fetchAll({
    nodes: true,
    servers: true
})
```

**Location details**  
Retrieves the specified location
- Value 1 - Required - Location id
- Value 2 - Nullable - Options object
    - nodes - List of nodes assigned to the location
    - servers - List of servers in the location
```js
ptero.locations.fetch(1, {
    nodes: true,
    servers: true
})
```

**Create location:**  
Creates a new location
- Value 1 - Required - configuration object
    - short - Required - String - Location name
    - long - Nullable - String - Location description
```js
ptero.locations.create({
    short: 'UK location'
    long: 'nodes that are located in uk'
})
```

**Update location:**  
Updates the specified location
- Value 1 - Required - Location id
- Value 1 - Required - configuration object
    - short - Required - String - Location name
    - long - Nullable - String - Location description
```js
ptero.locations.update(1, {
    short: 'UK'
    long: 'datacenters in uk'
})
```

**Delete location:**  
Updates the specified location
- Value 1 - Required - location id
```js
ptero.locations.delete(1)
```

#

**List servers:**  
Retrieves all servers
```js
ptero.servers.fetchAll()
```

**Server details:**  
Retrieves the specified servervv
- Value 1 - Required - server id
- Value 2 - Nullable - Options object
    - allocation - List of allocations assigned to the server
    - user - Information about the server owner
    - subusers - List of users added to the server
    - pack - Information about the server pack
    - nest - Information about the server's egg nest
    - egg - Information about the server's egg
    - variables - List of server variables
    - location - Information about server's node location
    - node - Information about the server's node
    - databases - List of databases on the server
```js
ptero.servers.fetch(1, {
    allocation: true,
    user: true,
    subusers: true,
    pack: true,
    nest: true,
    egg: true,
    variables: true, 
    location: true,
    node: true,
    databases: true
})
```


# ⚠️ To-Do List

✅ - completed  
⏩ - skipped for later

⏩ DO THE WRAPPER

# ⚙️ Options
soon
