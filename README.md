# abra

### Catch you the abra for much win!
Online browser typing game.

## Instructions
```
git clone https://github.com/pineman/abra && cd abra
npm install
cd client && make && cd -
npm test
```

To run in a more production-y environment with nginx:
```
cd client && make deploy && cd -
```
nginx conf file and systemd service file are provided in server/config.

## TODO
 * Different error color when cursor is red
 * npm all the things!
   * `abra-server`
   * `abra-client`
   * `abra-client-http`
   * `abra-client-cli`

## Ideas
 * CLI client
 * Post game chat
 * Autoscroll to visible span
 * Room links
 * More stats
 * Guarantee all sockets start at the same time (acknowledgement protocol)
 * Sound
 * Submit texts
 * Private rooms
 * Global ranking boards
 * Text chooser (also language)
 * Various game modes
 * More? Accounts?

made with :heart: @ FCUL
