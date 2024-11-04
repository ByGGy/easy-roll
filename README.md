# easy-roll

### Installation

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

### @ New Users

<img src='./easyRoll_ui_Start.png' width=600>

At the moment, two games are "supported":
* Aria
* Rêve de Dragon

You should first create a new Character for the game relevant to you.  
This new character will have a default name, and a default list of attributes and abilities based on the chosen game.  

Then you can customize your character, by selecting it and clicking one of the `pen` icons:  
<img src='./easyRoll_ui_EditCharacter.png' width=600>

### @ Users of v0.3.0

<img src='./easyRoll_ui_Start.png' width=600>

You should use the import option in order to retrieve your character(s) from deprecated JSON file(s).

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