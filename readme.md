# Cold Family Feud
I was unsatisfied with the family feud projects I found on github and I didn't want to use powerpoint(I use linux 🐧)

I so I decided to make it from scratch and make it as functional as possible.

This was a good project to learn how websockets work.

Nextjs + React + Tail Wind css

## Start
in project root

```
npm run build
npm run start
```
go to

http://localhost:3000/game  (Click on the browser window to allow sounds... not sure why this is a requirement in chrome)

http://localhost:3000/admin

Put /game on the projector/screen share. 

you'll want to screen share using an application that shares your audio 
> kinda hard on linux. Im thinking OBS/Twitch


## New Games

go to `/new` to use the new game creator

games are loaded in the admin console

I esspecially want to implement these in the future:
pull requests are welcome

- [x] questions are read from json and game can pick from multiple possible games
- [x] game can reset
- [ ] game looks closer to the family feud style
- [x] title is read from svg and can be dynamically updated instead of using inkscape
- [ ] node executable launches admin and game endpoints
