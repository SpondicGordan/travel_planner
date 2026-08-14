# Travel Planner – Aplikacija za planiranje putovanja

Projekat iz predmeta **Primena veb programiranja u infrastrukturnim sistemima**.

Web aplikacija koja korisniku omogućava da na jednom mjestu organizuje sve informacije
o putovanju: osnovne podatke o putovanju, destinacije, dnevni plan aktivnosti, troškove
i budžet, checklistu (packing listu) i dijeljenje plana sa drugim osobama putem QR koda.

> **Napomena o arhitekturi:** Projektni zadatak predviđa mikroservisnu arhitekturu
> realizovanu preko Microsoft Service Fabric platforme. Uz saglasnost predmetnog
> profesora, ova aplikacija je umjesto toga realizovana kao **jedinstvena višeslojna
> (layered) aplikacija** (backend organizovan po slojevima: Controllers → Services →
> Repositories → Data, uz jasno razdvajanje DTO i domenskih modela).

## Tehnologije

**Backend**
- ASP.NET Core Web API (C#)
- Entity Framework Core – Code First migracije
- Microsoft SQL Server
- JWT autentikacija (registracija, login, role: `user` / `admin`)

**Frontend**
- React + TypeScript
- Context API za upravljanje stanjem (auth, trenutni plan putovanja)
- HTTP pozivi izdvojeni u servisne module (nikad direktno u komponentama)
- `.env` konfiguracija za URL backend API-ja

## Arhitektura sistema (višeslojna)

| Sloj | Backend | Frontend |
|---|---|---|
| Prezentacioni | Controllers (REST API) | Stranice / komponente |
| Aplikacioni / servisni | Services (biznis logika, validacija) | Servisi (HTTP pozivi ka API-ju) |
| Pristup podacima | Repositories + `DbContext` (EF Core) | Context (globalno stanje) |
| Domenski / modeli | Entiteti (baza) + DTO (API ugovor) | TypeScript modeli/interfejsi |

DTO objekti i entiteti baze podataka su odvojeni, sa eksplicitnim mapiranjem između njih
(nema direktnog izlaganja entiteta baze kroz API).

*(Detaljan dijagram arhitekture i Use Case dijagram biće dodati u `/docs` kada budu urađeni.)*

## Funkcionalnosti

- Registracija i prijava korisnika (JWT, heširane lozinke), uloge `user` i `admin`
- CRUD nad planovima putovanja (naziv, opis, period, budžet, napomene)
- Upravljanje destinacijama u okviru plana
- Organizacija aktivnosti po danima + prikaz kroz kalendar
- Evidencija troškova po kategorijama, automatski obračun potrošenog i preostalog budžeta
- Checklist / packing lista sa označavanjem završenih stavki
- Pregled cijelog plana putovanja na jednom mjestu
- Dijeljenje plana putem QR koda / linka, sa pristupom tipa `VIEW` ili `EDIT`

## Struktura projekta

```
Veb2/
├── backend/     # ASP.NET Core Web API (Controllers, Services, Repositories, Models, DTOs, Data)
├── frontend/    # React + TypeScript aplikacija
└── docs/        # Arhitektura, Use Case dijagram
```

*(Struktura će biti popunjena i precizirana kako projekat bude napredovao.)*

## Pokretanje projekta

> Uputstvo će biti dopunjeno kada backend i frontend budu podignuti.

### Baza podataka
- TBD (SQL Server instanca, connection string, EF Core migracije)

### Backend
- TBD

### Frontend
- TBD

## Autor

Veljko Kondić, PR 122/2020

## Status

Projekat je u fazi izrade. Ovaj README se ažurira paralelno sa razvojem aplikacije.
