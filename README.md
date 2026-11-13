# SpaceRescue-MissionControl

## Opgavebeskrivelse
Året er 2479. Menneskeheden har etableret kolonier på fjerne planeter, rumstationer og måner. Men livet i rummet er ikke uden problemer. Rumskibe bryder sammen, forsyninger forsvinder, og forskningsstationer mister kontakten med omverdenen. Når katastrofen rammer, kontaktes SpaceRescue – galaksens centrale redningstjeneste. 

Indtil nu har SpaceRescue administreret missioner manuelt. Det har fungeret nogenlunde, men antallet af nødsituationer vokser, og systemet er begyndt at fejle. 

Redningsskibet Orion er det eneste ledige skib i nærheden af planeten Kepler-186f. To nødsituationer opstår næsten samtidigt. En forskningsstation mangler ilt, og et fragtskib har mistet sin motor. To operatører forsøger at tildele Orion til hver sin mission. Begge ser, at skibet er ledigt. Begge forsøger at reservere det. 

**Men Orion kan ikke være to steder på én gang.**

Jeres opgave er at udvikle SpaceRescues backend, som kan administrere redningsmissioner, rumskibe og tildelinger – også når flere operatører arbejder samtidigt. Der er ikke krav om en grafisk brugergrænseflade; I kan demonstrere løsningen med Postman.

## Arkitektur
<img width="798" height="398" alt="image" src="https://github.com/user-attachments/assets/336dc486-c88e-4df5-8938-8bed7bae93ad" />

## Startvejledning

Installer afhængighederne og start backend-serveren:

```bash
npm install
npm start
```

Indsæt de indledende testdata i MongoDB med:

```bash
npm run seed
```

Indstil `MONGODB_URI` til din MongoDB-forbindelsesstreng, før serveren startes
eller seed-scriptet køres.
Applikationen bruger databasen `SpaceRescue` og begynder først at lytte, når
forbindelsen er etableret. Serveren lytter som standard på port `3000`; porten
kan ændres med miljøvariablen `PORT`. Kør testene med:

```bash
npm test
```

Projektet indeholder den indledende API-struktur; forretningslogik implementeres
i senere issues.
