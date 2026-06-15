# 9-meeskond
Digital career assessment tool

Liikmed: Kristo Kukk, Antony Loodus, Jako Puusepp, Kevin Saluste, Samuel Beekmann, Nikita Soroka

## Deployment

The application is deployed as a Docker container and requires MySQL. It creates
its required database tables during startup.

Required environment variables are documented in `.env.example`. The container
listens on port `8118` and exposes `GET /health` for deployment health checks.
