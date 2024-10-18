# easy-roll

### For End Users

Setting up the app is a bit clunky atm.

Installation:
* on Windows, use the `*setup.exe` file provided  
_(the installer is minimalist, you will not get a progression feedback nor be asked where you want to install the app..)_
* on MacOS, there is no build atm, I'm looking into it
* on Linux, there is no build, and I do not expect to work on this anytime soon

Once the app is installed, you will have to create a `.json` file per character, in a specific folder, e.g.
`./characters/myCharacter.json`  
_(note its a relative path to the installed application `.exe` file)_

The character `.json` file should follow the following "schema":
```
{
  "game": "RPG game name",
  "name": "My character name",
  "attributes": [
    {
      "name": "Example",
      "value": 10
    },
  ],
  "abilities": [
    {
      "name": "Another example",
      "value": 10
    },
  ],
  "discordConfiguration": {
    "channelId": "In Discord, you can activate Dev mode, then right click a channel to copy/paste its id here"
  }
}
```

NB: atm, `Aria` and `Rêve de Dragon` are the exact values expected for the `game` property

### For Devs

To build a version locally, run `npm run package` then `npm run make`.  
_(it is not necessary to provide the `.nupkg` file with the installer)_

### Links

* Aria
  * Documentation: https://foundryvtt.wiki/fr/systemes/aria

* Rêve de dragon
  * Documentation: http://www.reves-d-ailleurs.eu/jeux/reve-dragon/REVE_DE_DRAGON_2emeEd_Livre_De_Regles2.pdf

* Discord
  * API: https://discord.com/developers/docs/resources/channel#create-message
  * Auth Token format: https://discord.com/developers/docs/reference#authentication
  * How to get a Bot Token: https://www.writebots.com/discord-bot-token/
  * How to find a ChannelId: https://geekrumor.com/how-to-enable-developer-mode-in-discord-1545/