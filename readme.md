# Cold Family Feud
I was unsatisfied with the family feud projects I found on github and I didn't want to use powerpoint(I use linux 🐧)

I so I decided to make it from scratch and make it as functional as possible.

Features:
- Game creator and loader. Look in `games/` folder for already created games
  load games in either `/new` or `/admin`
- seperated admin console from game window
- functional fast money round with appropriate controls
- Changable title screen text
- family feud sounds at triggered events
  (sounds are subject to copyright and will be changed later)

Nextjs + React + Tail Wind css

## Start
in project root

```
npm run build
npm run start
```
go to

http://localhost:3000/game  
(Click on the browser window to allow sounds... not sure why this is a requirement in chrome)

http://localhost:3000/admin

Put /game on the projector/screen share. 

you'll want to screen share using an application that shares your audio 

kinda hard on linux to get an application that will share your audio so here is a quick hack
with pulse audio to pipe your computer's sound through your microphone.

```sh
pactl load-module module-null-sink sink_name=MySink
pactl load-module module-loopback sink=MySink

in pulse audio choose outputs in recording tab

```
This will give you multiple recording sinks where you can attach one to your microphone and 
one your the monitor of your desktop or headset. Resulting in output audio getting piped to your application

## New Games

go to `/new` to use the new game creator

games are loaded in the admin console

I esspecially want to implement these in the future:
pull requests are welcome

If you make a new game that is themed, make a pull request and we can add it to the default games in `/games`

- [x] questions are read from json and game can pick from multiple possible games
- [x] game can reset
- [ ] game looks closer to the family feud style
- [x] title is read from svg and can be dynamically updated instead of using inkscape
- [ ] node executable launches admin and game endpoints
