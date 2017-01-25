# abra

### Catch you the abra for much win!
Online browser typing game.

## Instructions
```
git clone https://github.com/pineman/abra && cd abra
npm install
make -C client
npm test
```

To run in a more production-y environment with nginx:
```
make -C client deploy
```
nginx conf file and systemd service file are provided in server/config.

## TODO
 * Different error color when cursor is red
 * Prevent players in a room having the same color
 * Cookie client name
 * Recheck & reorganize client
 * npm all the things!
   * `abra-server`
   * `abra-client`
   * `abra-client-http`
   * `abra-client-cli`

## Ideas
 * CLI client using [blessed](https://github.com/chjj/blessed)
 * Post game chat
 * Room links
 * More stats
 * Autoscroll to visible span
 * Guarantee all sockets start at the same time
 * Sound
 * Submit texts
 * Private rooms
 * Leaderboard
 * Abra stats page or similar (all time words typed, etc.)
 * Text chooser (also language)
 * Various game modes
 * More? Accounts?

made with :heart: @ FCUL
