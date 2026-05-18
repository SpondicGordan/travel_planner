# Veb2_Project

Primena veb programiranja u infrastrukturnim sistemima

## Pregled arhitekture

Aplikacija je podeljena na tri sloja:

| Sloj          | Tehnologija                   | Opis                                     |
| ------------- | ----------------------------- | ---------------------------------------- |
| Frontend      | React + MUI                   | Korisnički interfejs                     |
| Backend       | ASP.NET Core + Service Fabric | Tri mikroservisa (Auth, Travel, Sharing) |
| Baza podataka | Microsoft SQL Server          | Jedna baza sa SQL migracijama            |

### Mikroservisi

- **AuthService** (Stateless) – registracija, logovanje, JWT autentikacija, upravljanje korisnicima (admin)
- **TravelService** (Stateful) – planovi putovanja, destinacije, aktivnosti, troškovi, checklist
- **SharingService** (Stateless) – generisanje i validacija tokena za deljenje planova

---

## Preduslovi

Pre pokretanja, potrebno je imati instalirano:

- [Node.js](https://nodejs.org/) (v18 ili noviji)
- [.NET SDK 9.0](https://dotnet.microsoft.com/download)
- [Microsoft SQL Server Express](https://www.microsoft.com/sql-server)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [Service Fabric SDK i Runtime](https://learn.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started)
- [Visual Studio 2022](https://visualstudio.microsoft.com/)
- [Git](https://git-scm.com/)

---

## Pokretanje projekta

### 1. Kloniranje repozitorijuma

```bash
git clone
cd travel_planner
```

### 2. Baza podataka

Otvoriti SSMS i kreirati bazu:

```sql
CREATE DATABASE TravelPlannerDb;
```

Pokrenuti migracije iz terminala:

```bash
cd backend/AuthService/AuthService
dotnet ef database update

cd ../../TravelService/TravelService
dotnet ef database update

cd ../../SharingService/SharingService
dotnet ef database update
```

### 3. Backend – konfiguracija

U svakom servisu proveriti `appsettings.json` i uneti ispravan connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TravelPlannerDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "TravelPlannerSuperSecretKey123456789!",
    "Issuer": "TravelPlannerApp",
    "Audience": "TravelPlannerUsers",
    "ExpiresInMinutes": "60"
  }
}
```

### 4. Backend – pokretanje

Otvoriti tri terminala i pokrenuti svaki servis:

```bash
# Terminal 1
cd backend/AuthService/AuthService
dotnet run

# Terminal 2
cd backend/TravelService/TravelService
dotnet run

# Terminal 3
cd backend/SharingService/SharingService
dotnet run
```

Servisi slušaju na:

- AuthService: `http://localhost:5157`
- TravelService: `http://localhost:5243`
- SharingService: `http://localhost:5008`

### 6. Frontend – konfiguracija

U folderu `frontend/` kreirati `.env` fajl:

REACT_APP_AUTH_API_URL=http://localhost:5157
REACT_APP_TRAVEL_API_URL=http://localhost:5243
REACT_APP_SHARING_API_URL=http://localhost:5008

### 7. Frontend – pokretanje

```bash
cd frontend
npm install
npm start
```

Aplikacija dostupna na: `http://localhost:3000`

---

## Struktura repozitorijuma

travel_planner/
├── frontend/ # React aplikacija
│ ├── src/
│ │ ├── components/ # UI komponente
│ │ ├── pages/ # Stranice
│ │ ├── services/ # HTTP pozivi ka backendu
│ │ ├── models/ # JavaScript modeli
│ │ └── context/ # Context API
│ └── .env.example
├── backend/
│ ├── AuthService/ # Autentikacija
│ ├── TravelService/ # Planovi putovanja
│ ├── SharingService/ # Dijeljenje planova
│ └── TravelPlannerApp/ # Service Fabric projekat
├── docs/
│ ├── architecture.png # Dijagram arhitekture
│ └── use-case.png # Use Case dijagram
└── README.md

## Korisničke uloge

| Uloga   | Opis                                                     |
| ------- | -------------------------------------------------------- |
| `USER`  | Kreira i upravlja sopstvenim planovima putovanja         |
| `ADMIN` | Sve što i USER + pregled i administracija svih korisnika |

---

## Napomene

- Lozinke se čuvaju heširane (BCrypt)
- JWT tokeni se validiraju pri svakom zahtjevu
- Brisanje plana automatski briše sve povezane entitete
- URL-ovi backenda se čitaju iz `.env` fajla

---

## Autor

Kondic Veljko PR 122/2020
