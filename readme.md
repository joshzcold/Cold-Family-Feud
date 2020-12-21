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

http://localhost:3000/game
http://localhost:3000/admin

Put /game on the projector/ screen share. 

you'll want to screen share using an application that shares your audio 
> kinda hard on linux. Im thinking OBS/Twitch

## Title screen 
I created a title screen that mimics family feuds. 

`public/title.svg` has my family name on it 

you can use a title screen without the family name by renaming

`public/title-original.png => public/title.png`

`public/title-original.svg => public/title.svg`

the application uses `public/title.png` in the actual title screen

edit `public/title-original.svg` in inkscape and export to .png to change the title

## Questions

the game data comes from `questions.js` 

at time of this writing questions.js is a christmas game 🎅🎄

this file is quite tacked togethor. 

pull requests are welcome

I esspecially want to implement these in the future:

- [ ] questions are read from json and game can pick from multiple possible games
- [ ] game can reset
- [ ] game looks closer to the family feud style
- [ ] title is read from svg and can be dynamically updated instead of using inkscape
