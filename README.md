# easy-roll

### For End Users

Setting up the app is a bit clunky atm.

---

Download the latest release at https://github.com/ByGGy/easy-roll/releases/latest  
_(the installer is minimalist, you will not get a progression feedback nor be asked where you want to install the app..)_

NB: the app is not signed / notarized, therefore:
* on Windows, you will be warned and asked for an install confirmation
* on macOS, you will have to do the following (cf https://discussions.apple.com/thread/253714860?sortBy=best):
> When an application gets downloaded from any source other than those that Apple seems suited, the application gets an extended attribute "com.apple.Quarantine".  
This triggers the message: "<application> is damaged and can't be opened. You should move it to the Bin."  
Remove the attribute and you can launch the application.  
To do this, open a console and type:
```
$ xattr -c <path/to/application.app>
```

---

Once the app is installed, you will have to create a `.json` file per character, in a specific folder (`userData`), e.g.:
* on Windows: `C:\Users\<User>\AppData\Roaming\easy-roll\characters\myCharacter.json`
* on macOS: `/Users/<User>/Library/Application Support/easy-roll/characters/myCharacter.json`
* on Linux: `/home/<User>/.config/easy-roll/characters/myCharacter.json`

The character `.json` file should follow the following "schema":
```
{
  "game": "RPG game name",
  "name": "My character name",
  "attributes": [
    {
      "name": "Attribute A",
      "value": 8
    },
    {
      "name": "Attribute B",
      "value": 12
    }
  ],
  "abilities": [
    {
      "name": "Ability A",
      "value": 4
    },
    {
      "name": "Ability B",
      "value": 2
    }
  ],
  "discordConfiguration": {
    "channelId": "In Discord, you can activate Dev mode, then right click a channel to copy/paste its id here"
  }
}
```

NB: atm, the exact values expected for the `game` property are: `Aria` or `Rêve de Dragon`

---

Below is a screenshot using the `.json` from the example:  
<img src='./easyRoll_ui.png' width=600>


### For Devs

To build a version locally, run `npm run package`.

To make an installer locally, run `npm run make`.  
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