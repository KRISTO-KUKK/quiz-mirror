# Pullivara Career Clarity Test

![Pullivara eelvaade](docs/pullivara-preview.svg)

## Mis see on?

Pullivara Career Clarity Test on veebirakendus, kus kasutaja saab e-mailile ligipääsukoodi ja täidab lühikese karjääriteemalise testi. Testi lõpus näeb kasutaja oma karjäärifaasi ja persona/arhetüüpi ning saab tulemuse ka e-mailile. Rakendus aitab kasutajal mõelda, kus ta praegu oma karjääris paikneb ja millised võiksid olla järgmised sammud. Admini vaates saab vaadata, mitu testi on alustatud, lõpetatud või pooleli jäetud.

Projekt on tehtud Tallinna Ülikooli Digitehnoloogiate instituudi õppetöö raames. See ei ole päris valmis äritoode, vaid kursuse projekt, mille eesmärk oli ehitada toimiv veebirakendus koos backend'i, andmebaasi, autentimise ja lihtsa adminivaatega.

## Autorid

- Kristo Kukk
- Antony Loodus
- Jako Puusepp
- Kevin Saluste
- Samuel Beekmann
- Nikita Soroka

## Kasutatud tehnoloogiad

Versioonid on võetud `package.json` ja Dockerfile'i järgi.

- Node.js 24 Alpine
- npm
- Express 5.2.1
- EJS 6.0.1
- MySQL 8
- mysql2 3.22.5
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3
- nodemailer 9.0.1
- dotenv 17.4.2
- cors 2.8.6
- HTML, CSS ja tavaline brauseri JavaScript
- Docker / Coolify deploymentiks

## Projekti käivitamine lokaalselt

Eeldused:

- Node.js ja npm
- MySQL server
- Gmaili app password või muu toimiv SMTP seadistus Gmaili jaoks

1. Klooni repo:

```bash
git clone https://github.com/KRISTO-KUKK/quiz-mirror.git
cd quiz-mirror
```

2. Paigalda sõltuvused:

```bash
npm install
```

3. Loo `.env` fail. Näidis:

```env
PORT=8118
NODE_ENV=development

EMAIL_USER=sinumeil@gmail.com
EMAIL_PASS=gmail-app-password

JWT_SECRET=mingi-pikk-suvaline-saladus
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=parool
DB_NAME=pullivara
```

4. Loo MySQL andmebaas:

```sql
CREATE DATABASE pullivara CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Rakendus loob vajalikud tabelid käivitumisel ise. Kui tahad tabelid käsitsi luua või kontrollida, siis struktuur on selline:

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  code VARCHAR(6) NOT NULL,
  code_expires_at DATETIME NOT NULL,
  code_used BOOLEAN NOT NULL DEFAULT FALSE,
  authenticated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_sessions_email_code (email, code, code_used, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NULL,
  status ENUM('started', 'completed', 'abandoned') NOT NULL DEFAULT 'started',
  last_question SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  answers_s1 JSON NULL,
  answers_s2 JSON NULL,
  result_stage VARCHAR(64) NULL,
  result_archetype VARCHAR(128) NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_quiz_attempts_session_status (session_id, status),
  CONSTRAINT fk_quiz_attempts_session
    FOREIGN KEY (session_id) REFERENCES sessions(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

5. Käivita rakendus:

```bash
npm start
```

6. Ava brauseris:

```text
http://localhost:8118
```

Admini vaade on:

```text
http://localhost:8118/admin
```

## Deployment Coolifyga

Projektis on `Dockerfile`, seega Coolifys saab valida Dockerfile build'i.

Olulisemad muutujad Coolifys:

```env
PORT=8118
NODE_ENV=production
DB_HOST=<mysql-internal-host>
DB_PORT=3306
DB_USER=<mysql-user>
DB_PASS=<mysql-password>
DB_NAME=<mysql-database>
EMAIL_USER=<gmail-address>
EMAIL_PASS=<gmail-app-password>
JWT_SECRET=<long-random-secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<admin-password>
```

MySQL host peab olema Coolify sisemine host, mitte `localhost`.

Healthcheck:

```text
/health
```

## Projekti struktuur

```text
server/        Express backend, API route'id, andmebaasi ühendus
views/         EJS vaated
script/        Frontendi JavaScript ja skoorimisloogika
src/           Pildid ja logo
style.css      Kogu põhiline kujundus
docs/          README pilt
```

## Litsents

Projekt on MIT litsentsiga. Vaata faili [LICENSE](LICENSE).
