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

### @ Users

At the moment, three games are "supported":  
<img src='./public/images/Aria_Cover.jpg' width=75> <img src='./public/images/Reve-de-Dragon_Cover.jpg' width=75> <img src='./public/images/BaSIC_Cover.jpg' width=75>

You should first create a new `Session` for the game relevant to you.  
<img src='./EasyRoll_UI_Start.png' width=600>

---

Once a new session has been created, you can select it and add some characters to it:  
<img src='./EasyRoll_UI_AddCharacter.png' width=600>

There is 3 options:
1. create a new character from scratch, mostly for new users
2. add an already existing character, mostly for users of `v0.3.0` and `v0.4.0`  
_(or if you want to reuse a character from another session)_
3. import a character from a JSON file  
_(probably not needed anymore, kinda deprecated..)_

---

Once a character has been added, select it and click one of the `pen` or `more` icons to edit its:  
* name
* attributes
* abilities
* dice tray
* discord configuration

<img src='./EasyRoll_UI_EditCharacter.png' width=600>

NB: at the moment, each character has its own discord configuration.

---

On the character page, you also have access to a quick / custom roll via the dice shorcut:
<img src='./EasyRoll_UI_QuickRoll.png' width=600>

---

NB: at the moment, it is not possible to delete a session or character.

---

### Links

* Aria
  * Documentation: https://foundryvtt.wiki/fr/systemes/aria

* Rêve de dragon
  * Documentation: http://www.reves-d-ailleurs.eu/jeux/reve-dragon/REVE_DE_DRAGON_2emeEd_Livre_De_Regles2.pdf

* BaSIC
  * Documentation: https://www.rolis.net/catalogue/jeu/93/basic

* Discord
  * API: https://discord.com/developers/docs/resources/channel#create-message
  * Auth Token format: https://discord.com/developers/docs/reference#authentication
  * How to get a Bot Token: https://www.writebots.com/discord-bot-token/
  * How to find a ChannelId: https://geekrumor.com/how-to-enable-developer-mode-in-discord-1545/

* Electron
  * Signing: https://www.electronjs.org/docs/latest/tutorial/code-signing
  * MacOS Notarize: https://shirker.medium.com/electronjs-sign-and-notarize-your-macos-application-6be5cf713053
  * Notarize module: https://github.com/electron/notarize