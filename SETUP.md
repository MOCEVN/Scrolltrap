# React Native

Ik heb dus een kleine test project opgezet om te kijken hoe React Native werkt. Na een beetje inlezen ben ik uitgekomen op de Expo Go app. Het is een app dat je kan downloaden via de Google Play Store & App store. Door deze app kan je een project opzetten en gelijk bekijken via je telefoon als "mobiele app". Om het te bekijken via je telefoon moet je wel steeds op de app zelf gaan. Voor nu een begin fase leek het me wel handig. Het kan altijd nog veranderen ofcourse. En met een EAS Build kan je uiteindelijk de applicatie zetten op appstore of google play store.

### Alternatief: Expo Development Build

Met `expo dev-client` kun je een custom Expo Go app maken.

Tip: altijd npx expo ... gebruiken als je de nieuwe CLI wilt gebruiken, in plaats van het globale expo commando.

`npx expo start --web --tunnel`
De --tunnel optie maakt een publieke URL die overal toegankelijk is, ook buiten je Wi-Fi netwerk.
URL is geldig zolang je `npx expo start --web --tunnel` draait

Als ik dat draai krijg ik `https://mb3choc-mocevn-8081.exp.direct/` te zien als werkende link.

- Zodra je het proces stopt of je computer afsluit, werkt de link niet meer. Testers krijgen dan een foutmelding.
- Elke keer dat je de tunnel opnieuw start, wordt er een nieuwe URL aangemaakt.
- Dat betekent dat je de nieuwe link opnieuw moet delen met je testers.
- Het heeft geen permanente hosting

*Dit is echt bedoeld voor snelle test- en prototype-doeleinden.*

## Stappenplan voor Project Setup en Webtunnel Testen

Dit stappenplan laat zien hoe je een Expo-project met EAS lokaal kunt opstarten en testen via de **webtunnel**. Alles staat in één consistente Markdown-indeling zodat je het direct kunt kopiëren en gebruiken.

---

### Vereisten Installeren

Ik heb een organisatie aangemaakt en projext in <https://expo.dev/accounts/dark-tech-scrolltrap>

Hiervoor moet je dus een account aanmaken en als jullie die hebben kan ik jullie uitnodigen als members.

Het is eerst handiger om zelf een beetje te kijken hoe het werkt en ook via de app.

Voer de volgende commando's uit om alle benodigde software te installeren:

```bash
# Node.js en npm installeren (Node.js LTS aanbevolen)
# npx wordt automatisch mee geïnstalleerd met npm

# Expo CLI globaal installeren (optioneel)
npm install -g expo-cli

# EAS CLI globaal installeren
npm install -g eas-cli
```

### Clone de repository

`git clone https://github.com/MOCEVN/scrolltrap-v1`

### Ga naar de projectmap

`cd <PROJECT_DIRECTORY>`

### Installeer alle project-dependencies

`npm install`

### Inloggen via npx

`npx expo login`

### Of, als Expo globaal is geïnstalleerd

`expo login`

### Start het project in web-mode met tunnel

`npx expo start --web --tunnel`

De Expo Dev Tools openen automatisch in je browser.
Je ziet een Tunnel URL, bijvoorbeeld:
<https://exp.host/@username/projectname>

### Extra links
<https://docs.expo.dev/get-started/set-up-your-environment/>

<https://reactnative.dev/docs/environment-setup>

<https://docs.expo.dev/eas/workflows/automating-eas-cli/>

<https://www.youtube.com/watch?v=uQCE9zl3dXU>

**Manage branches and channels with EAS CLI:**
<https://docs.expo.dev/eas-update/eas-cli/>

**Nativewind**
<https://www.nativewind.dev/>

### Extra info voor android of ios

EAS staat voor Expo Application Services. Hiermee kan je een native build maken van je app:

`.apk` voor Android

`.ipa` voor iOS

Anderen je app laten testen
Voor Android:

Je kunt de .apk direct delen. Mensen moeten dan “Install from unknown sources” toestaan.

Handiger: gebruik Expo’s TestFlight-achtige oplossing:

Upload naar Google Play Internal Testing (sneller en veiliger).

Voor iOS:

Je iOS app moet via TestFlight (Apple) gedeeld worden.

Je upload de .ipa naar App Store Connect → nodig testers toevoegen → zij krijgen een uitnodiging via TestFlight.
