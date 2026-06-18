# Testimise dokumentatsioon

See fail kirjeldab, mida projekti juures käsitsi testisime. Rakendus on üsna väike, seega tegime peamiselt manuaalseid teste brauseris ja vaatasime ka serveri logisid. Testimise eesmärk oli kontrollida, et tavakasutaja saab testi läbida ja admin näeb tulemuste infot.

## Testkeskkond

- Rakendus jooksis lokaalselt ja hiljem Coolify serveris.
- Backend: Node.js ja Express.
- Andmebaas: MySQL.
- Brauserid: Chrome / Chromium põhine brauser.
- Testandmeid sisestati käsitsi vormidesse.

## Testitud osad

### 1. Avaleht

**Mida kontrollisime**

- Avaleht avaneb ilma veata.
- Nupp "Take the test" viib ligipääsu küsimise lehele.
- Leht näeb desktopis ja mobiilis normaalne välja.

**Tulemus**

Avaleht avanes ja nupp viis õigesse kohta. Mobiilivaates tuli kujundust muuta, sest alguses oli layout liiga desktopi moodi.

### 2. Ligipääsukoodi küsimine

**Mida kontrollisime**

- Kui nimi või e-mail on tühi, siis koodi ei saadeta.
- Kui nimi ja e-mail on täidetud, siis süsteem salvestab sessiooni andmebaasi.
- Kasutajale saadetakse ligipääsukood e-mailile.
- Pärast saatmist avaneb koodi sisestamise modal.

**Tulemus**

Tühjade väljadega näidati veateadet. Korrektsel sisestusel saadeti kood e-mailile ja modal avanes.

### 3. Ligipääsukoodi kinnitamine

**Mida kontrollisime**

- Tühja koodi sisestamisel näidatakse veateadet.
- Vale koodiga ei saa edasi.
- Õige koodiga saab minna testi lehele.
- Koodi ei saa kasutada lõputult uuesti, sest server märgib selle kasutatuks.

**Tulemus**

Vale kood andis veateate. Õige koodiga loodi kasutajale sisselogimise cookie ja kasutaja suunati testi juurde.

### 4. Testi alustamine

**Mida kontrollisime**

- Testi ei saa avada otse aadressilt `/quiz`, kui kasutaja ei ole koodiga kinnitatud.
- Pärast õiget koodi saab testi alustada.
- Server loob `quiz_attempts` kirje.

**Tulemus**

Ilma kinnitatud sessioonita suunatakse kasutaja tagasi ligipääsu lehele. Õige sessiooniga test avanes ja attempt salvestati.

### 5. Vastuste valimine ja liikumine

**Mida kontrollisime**

- Ilma vastust valimata ei saa järgmise küsimuse juurde minna.
- Vastuse valimisel liigub kasutaja järgmise küsimuse juurde.
- Eelmise küsimuse nupuga saab tagasi liikuda.
- Vastused salvestatakse serverisse.

**Tulemus**

Tühja vastusega näidati veateadet. Valitud vastused jäid alles ja serverisse salvestati `answers_s1`, `answers_s2` ning `last_question`.

### 6. Pooleli jäänud testi jätkamine

**Mida kontrollisime**

- Kui kasutaja alustab testi ja lahkub enne lõppu, jääb pooleli jäänud koht meelde.
- Uuesti testi avades jätkab süsteem õige koha pealt.

**Tulemus**

Rakendus taastas pooleli jäänud testi andmebaasis oleva `last_question` väärtuse järgi.

### 7. Tulemuse arvutamine

**Mida kontrollisime**

- Pärast kõigile küsimustele vastamist arvutatakse career stage.
- Persona/arhetüüp arvutatakse teise osa vastuste järgi.
- Tulemuse lehel kuvatakse kirjeldus, key insights ja järgmised sammud.

**Tulemus**

Tulemus kuvati brauseris. Skoorimisloogika on eraldi failis `script/scoring.js`, mida kasutab nii frontend kui backend.

### 8. Tulemuse e-mail

**Mida kontrollisime**

- Pärast testi lõpetamist saadetakse tulemus kasutaja e-mailile.
- Kui e-maili saatmisel tekib viga, siis rakendus ei tohiks kogu testi katki teha.

**Tulemus**

Tulemuse e-mail saadeti. Serveris on e-maili saatmine tehtud nii, et vea korral logitakse probleem, aga kasutaja saab tulemuse lehel ikkagi edasi.

### 9. PDF allalaadimine

**Mida kontrollisime**

- Tulemuse lehel olev "Download Full Report" nupp loob PDF-faili.
- PDF-is on kasutaja nimi, career stage, persona ja kirjeldus.

**Tulemus**

Nupp laadis alla PDF-faili. Faili sisu oli loetav ja vastas lehel näidatud tulemusele.

### 10. Admini vaade

**Mida kontrollisime**

- Admin saab sisse logida kasutajanime ja parooliga.
- Vale parooliga ei saa sisse.
- Dashboard näitab alustamiste, lõpetamiste ja katkestamiste arvu.
- Logitabelis on näha kasutaja nimi, e-mail, olek ja tulemus.

**Tulemus**

Admini login töötas. Vale parool andis veateate. Dashboard luges andmeid MySQL tabelitest.

### 11. Imelike andmete sisestamine

**Mida kontrollisime**

- Tühi nimi.
- Tühi e-mail.
- Tühi ligipääsukood.
- Vale ligipääsukood.
- Testis edasi liikumine ilma vastuseta.
- Otselingiga `/quiz` avamine ilma kinnitatud sessioonita.

**Tulemus**

Kõigi nende juhtumite puhul kuvas rakendus veateate või suunas kasutaja tagasi ligipääsu lehele. See oli oluline, sest alguses sai mõnes olukorras liiga lihtsalt otse quiz lehele minna.

## Leitud probleemid ja parandused

- Mobiilivaade oli alguses liiga lai ja meenutas desktop layout'i. Parandasime CSS media query'dega.
- Ligipääsu kontroll vajas tugevdamist, sest ainult frontend'i andmeid ei saa usaldada. Parandasime nii, et server kontrollib JWT cookie ja andmebaasi sessiooni.
- Coolify deploymentis tuli õigesti seadistada MySQL host, sest `localhost` konteineris ei tähenda andmebaasi.
- Admini testparooli jaoks lisasime lihtsama `ADMIN_PASSWORD` variandi, sest bcrypt hash'i `$` märgid võivad Coolify muutujates segadust tekitada.

## Kokkuvõte

Põhiline kasutajavoog töötab: kasutaja küsib koodi, kinnitab selle, teeb testi, näeb tulemust, saab e-maili ja saab PDF-i alla laadida. Admin saab vaadata üldist statistikat ja logi. Testimine oli peamiselt manuaalne, sest projekti maht on väike ja kursuse jaoks oli tähtsam kontrollida päris kasutajavoogu brauseris.
