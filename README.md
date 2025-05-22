# firebaseFunctionsExempel

Firebase Functions skriver vi med javascript och vi använder node/npm för att installera firebase CLI

[VS Code](https://code.visualstudio.com/download)


[node](https://nodejs.org/en)


### 1. Installera Firebase CLI:
Öppna ett termialfönster:

```bash
npm install -g firebase-tools

firebase —version
```


————

### 2. Logga in på firebase I terminalen:
```bash
firebase login
```


Följ länk och logga in med samma google konto som du använder på firebase

————

### 3. Skapanytt firebaseproject/koppla in befintlig

När du har ett firebaseprojekt så lägger du till functions från vänstra menyn och clickar sen på get started.
Fälj instruktionerna

—————
### 4. Initiera firebase projekt

Skapa och navigera till en ny mapp på datorn där u vill ha dina firebase functions filer.

```bash
#skapa och navigera till mapp i terminalen:
mkdir hello-functions
cd hello-functions

#när du är i rätt mapp:
firebase init functions
```

Svar du kan ge i prompten:

- Which Firebase CLI features?: Tryck space på Functions → Enter
- Associate with a Firebase project: Välj ditt projekt
- Language: Välj JavaScript 
- ESLint?: Valfritt, kan svara Yes eller No.
- Install dependencies?: Yes

—————

### 5. Redigera functions/index.js

Nu kan du börja redigera index.js filen. Det är här vi skriver våra functions som ve sen exporterar till firebase
Kodexempel finns i repot

### 6. Deploy till firebase

När vi är nöjda med våra functions så deployar vi dessa via terminalen

```bash
firebase deploy --only functions
```

### Om nåt går fel:

Många saker kan gå fel när man gör en deploy.
Några saker man kan prova:

testa om google cloud är konfigurerat:

```bash
gcloud services enable artifactregistry.googleapis.com
```

Om cloud inte finns, installera med brew

```bash
brew install --cask google-cloud-sdk

gcloud init
```

Vill man testa endpoint: gå till URL

får du error 403?
Om du har nyare versioner av node så sätts endpoins till private. För att öppna dessa så kan du antingen:

A) kör emulerad miljö:
```bash
firebase emulators:start
```

eller

B) öppna endpointen för alla:
```bash
gcloud functions add-iam-policy-binding helloWorld \
  --region=us-central1 \   #din region
  --member="allUsers" \
  --role="roles/run.invoker"
```




