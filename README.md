# IntroTo-SignalR

Welcome to the IntroTo-SignalR repository! This project provides a comprehensive introduction to using SignalR, a library for ASP.NET Core that facilitates real-time web functionality. SignalR is perfect for applications requiring instant updates from the server, such as chat apps, live dashboards, and collaborative tools.

## Hub and Clients

- A Hub is a class derived from the Hub base class.
- It is able to maintain connections with clients.
- A Hub in SignalR is a central class that enables communication between a server and connected clients.

```csharp
builder.Services.AddSignalR();
```

```csharp
app.MapHub<AuctionHub>("/actionhub");
```

Action Hub will be mapped to the /actionhub route and clients can be connected to the hub using this route.

`Client` in the base class of hub can be used to get the connected client.

## Remote Procedure Call (RPC)

Procedure → Method / Function

```csharp
public class AuctionHub : Hub
{
    public async Task NotifyNewBid(ActionNotify actionNotify)
    {
        await Clients.All.SendAsync("ReceiveNewBid", actionNotify);
    }
}
```

`NotifyNewBid` method can be called remotely by clients. The hub method sends a message to all clients. This message is an instruction to call `ReceiveNewBid` function, passing in the auction.

SignalR used a hub protocol that defines the format of the message that go back and forth just like HTTP.

```json
{
 "type": 1,
 "target": "ReceivedNewBid",
 "arguments": [{"auctionId": 1, "newBid": 25}]
}
```

## Connections

- A SignalR connection represents the relationship between a client and a server URL.
- This relationship is managed by the SignalR API and identified by a unique connection ID.
- SignalR maintains data about the connection to facilitate the transport connection.
- The connection ends when:
  - The client invokes the Stop method.
  - A timeout occurs while attempting to re-establish a lost transport connection.
- SignalR disposes of the connection data after it ends.

## Transport Connection

- A transport connection represents the logical relationship between a client and a server.
- It is maintained by one of four transport APIs: WebSockets, server-sent events, forever frame, or long polling.
- SignalR utilizes the transport API to establish the transport connection.
- The transport API requires a physical network connection to create the transport connection.
- The transport connection ends when:
  - SignalR terminates it.
  - The transport API detects a broken physical connection.

## Transports

- WebSocket
- Server Sent Event (SSE)
- Long Pooling

### WebSocket

- Only transport that offers a true 2-way, full-duplex connection between client and server that stays open.
- Upgrades the socket of a normal HTTP request to a WebSocket.
- The connection stays until closed or a network problem occurs.

### Server Sent Event

- Uses HTTP requests.
- Can do server to client HTTP requests.

### Long Polling

- For server to client messages the client does an HTTP request to the server which remains open.
- Until there is a message to send or a request timeout occurs.
- Rinse and repeat

## How do decide which transport to use?

- WebSocket has to be supported throughout the network chain.
- If not SignalR will fall back to server sent events or long polling.
- Need for other transports is less nowadays.
- Consider disabling negotiation and fall back.

```jsx
this.hubConnection = new SignalR.HubConnectionBuilder()
  .withUrl(APIConstants.BaseAddress + APIConstants.AuctionHubAddress,
    {
      withCredentials: false,
      transport: SignalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    }).build();
```

## IHubContext

- Can be used anywhere in the application.
- Doesn’t have the concept of a caller.

## Groups

**Groups** in SignalR are used to manage connections efficiently and target specific audiences within your connected clients. Groups are created automatically when a client is added and removed automatically when the last client leaves.

- Groups of clients
- Use connection id
- Heads up: connection ids change on new connection
- Dynamic, on the fly
- Functions can be called on groups

Here are some key lines to note in Notion:

**Add to Group**:

```csharp
await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
```

**Remove from Group**:

```csharp
await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
```

**Send Message to Group**:

```csharp
await Clients.Group(groupName).SendAsync("ReceiveMessage", message);
```

## Hub Protocol

MessagePack is a binary serialization format that is compact and efficient, making it ideal for scenarios where bandwidth and performance are critical. When used with SignalR, MessagePack serves as an alternative to the default JSON-based protocol for serializing and deserializing messages.

MessagePack encodes data into a binary format, which is smaller and faster to process than JSON, especially for complex or large data structures.

### Server Setup

```csharp
services.AddSignalR().AddMessagePackProtocol();
```

### JavaScript Client

```jsx
new signalR.HubConnectionBuilder().withHubProtocol(new signalR.protocols.MessagePack
```

## Reconnect on connection failure

SignalR has built-in support for automatic reconnection after connection drops.
Use `.WithAutomaticReconnect()` in the client setup.

```jsx
var connection = new HubConnectionBuilder()
    .WithUrl("/chatHub")
    .WithAutomaticReconnect()
    .Build();
```

By default, tries to reconnect at 0, 2, 10, and 30 seconds. You can customize this.

### Stateful Reconnect

A new feature called SignalR stateful reconnect has been introduced in .NET 8 to reduce downtime for clients facing temporary network disconnects. This works by temporarily buffering data on both the server and client, acknowledging received messages, and replaying any missed messages upon reconnection.

Opt-in to stateful reconnect at both the server hub endpoint and the client:

- Update the server hub endpoint configuration to enable the AllowStatefulReconnects option:

    ```csharp
    app.MapHub("/hubName", options =>
    {
        options.AllowStatefulReconnects = true;
    });
    ```

- Optionally, the maximum buffer size in bytes allowed by the server can be set globally or for a specific hub with the StatefulReconnectBufferSize option:

    The StatefulReconnectBufferSize option set globally:

    ```csharp
    builder.AddSignalR(o => o.StatefulReconnectBufferSize = 1000);
    ```

    The StatefulReconnectBufferSize option set for a specific hub:

    ```csharp
    builder.AddSignalR().AddHubOptions(o => o.StatefulReconnectBufferSize = 1000);
    ```

    The StatefulReconnectBufferSize option is optional with a default of 100,000 bytes.

- Update JavaScript or TypeScript client code to enable the withStatefulReconnect option:

    ```java
    const builder = newsignalR.HubConnectionBuilder()
      .withUrl("/hubname")
      .withStatefulReconnect({ bufferSize: 1000 });  // Optional, defaults to 100,000
    const connection = builder.build();
    
    ```

    The bufferSize option is optional with a default of 100,000 bytes.

- Update .NET client code to enable the WithStatefulReconnect option:

    ```csharp
    var builder =new HubConnectionBuilder()
          .WithUrl("")
          .WithStatefulReconnect();
      builder.Services.Configure(o => o.StatefulReconnectBufferSize = 1000);
    var hubConnection = builder.Build();
    
    ```

    The StatefulReconnectBufferSize option is optional with a default of 100,000 bytes.

## Things to Check When Deploying

- Turn on/allow WebSocket
- Check WebSocket connection limit
- Enable sticky sessions/ARR affinity when using other transports

## Scaling

- Running multiple application instances
- Load balancer picks server
- Problem with non-WebSocket transport

When using non-WebSocket transport methods (such as long polling, Server-Sent Events, or HTTP polling), each request can be routed to a different server in a load-balanced environment. This can cause issues because the session state or connection-specific data may not be shared across servers. As a result, the client might encounter inconsistencies, dropped connections, or unexpected behaviors.

### Solution: Sticky Sessions/ARR Affinity

**Sticky Sessions** ensure all client requests are directed to the same server, maintaining session consistency. In IIS, **ARR Affinity** uses cookies to implement this, preventing issues with non-WebSocket transport.

## Redis Backplane for Scaling

A Redis Backplane is a system that uses Redis to enable communication between multiple servers in a distributed application. It acts as a central hub where servers can share messages and updates in real-time, ensuring all servers stay synchronized. This setup is crucial for maintaining consistency across a load-balanced environment, supporting real-time features like notifications or chat.

Here’s a simplified breakdown of how it works:

1. **Publish/Subscribe (Pub/Sub) Model:**
    - Servers in the system can publish messages (like updates or notifications) to specific channels in Redis.
    - Other servers subscribe to these channels to receive the published messages.
2. **Message Flow:**
    - When a server needs to broadcast an update (e.g., a user sends a chat message), it publishes this update to Redis.
    - Redis then immediately forwards the message to all servers subscribed to that channel.
3. **Synchronization:**
    - Because all servers receive the same messages from Redis, they can stay synchronized with each other. This is important in scenarios where the application is spread across multiple servers to handle large numbers of users or requests.
4. **Consistency Across Servers:**
    - Redis ensures that no matter which server a user is connected to, they will receive the same information as users connected to other servers. This prevents discrepancies in data or state across the system.

## Azure SignalR Service

- No worries about connection limits
- Sticky sessions are handled
- No need for Redis backplane
- Scalable
- Keep Alive Messages will not be counted.
