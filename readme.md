# weapon-sim
A tool to simulate ranged combat encounters for the Alien RPG, which in turn uses the year zero system of multiple d6.

Currently only supports Mentorian's custom Fireteam Elite weapon list.

# Why
It can be helpful to know which weapon is may be strong in a given situation. 

# Future 
- Need to make the weapons account for the talents. If this proves popular, I'll add that.
- Planning on adding the real weapons eventually. Anyone who wants to contribute can modify this file:
	- https://github.com/claydegruchy/weapon-sim/blob/master/src/components/weapons.json

# How do I use this

-   `git clone`
-   `pnpm i`
-   `npm run dev` to start. More info on launching in [Vite docs](https://vitejs.dev/guide/#community-templates)
-   Get to work

# Other features
- `npm run generate <name>` will make a component in `src/components/` and copy it's react reference to clipboard