# Flos Tools - Setup Anleitung

## Voraussetzungen

- Node.js 18+ installiert
- Supabase Account
- Vercel Account (optional für Deployment)

## 1. Projekt Setup

```bash
npm install
```

## 2. Supabase Konfiguration

### Datenbank Migration ausführen

1. Gehe zu deinem Supabase Dashboard
2. Navigiere zu **SQL Editor**
3. Führe die SQL-Befehle aus `supabase-migration.sql` aus:

```sql
-- Add category column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'program';

-- Add created_at column if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Update existing posts to have a default category if NULL
UPDATE posts SET category = 'program' WHERE category IS NULL;
```

### Storage Buckets erstellen

Erstelle zwei öffentliche Storage Buckets in Supabase:

1. **images** - für Bild-Uploads
2. **files** - für Datei-Uploads (Programme, APKs, etc.)

**Wichtig:** Beide Buckets müssen auf **public** gesetzt sein!

### Environment Variables

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-supabase-anon-key
```

Diese Werte findest du in deinem Supabase Dashboard unter **Settings > API**.

## 3. Admin User erstellen

1. Gehe zu **Authentication > Users** in Supabase
2. Erstelle einen User mit der E-Mail: `def4lt123@gmail.com`
3. Setze ein sicheres Passwort

**Hinweis:** Nur dieser User hat Admin-Zugriff!

## 4. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

## Features

### Homepage
- ✅ Suchfunktion für Posts
- ✅ Kategorien-Filter (Programme, Tutorials, APKs)
- ✅ Responsive Grid-Layout
- ✅ Modal-Ansicht für Post-Details
- ✅ Download-Links für Dateien

### Admin Dashboard (`/admin`)
- ✅ Sicherer Login (nur def4lt123@gmail.com)
- ✅ Posts erstellen mit Bild & Datei-Upload
- ✅ Posts bearbeiten
- ✅ Posts löschen
- ✅ Kategorie-Auswahl (Programm, Tutorial, APK)
- ✅ Toast-Notifications für Feedback

## Deployment auf Vercel

1. Pushe dein Projekt zu GitHub
2. Verbinde das Repository mit Vercel
3. Füge die Environment Variables in Vercel hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Troubleshooting

### "Bucket not found" Fehler
- Stelle sicher, dass die Storage Buckets `images` und `files` existieren
- Prüfe, ob beide Buckets auf **public** gesetzt sind

### Admin Login funktioniert nicht
- Prüfe, ob der User `def4lt123@gmail.com` in Supabase existiert
- Stelle sicher, dass die E-Mail bestätigt ist

### Posts werden nicht angezeigt
- Führe die SQL-Migration aus (siehe oben)
- Prüfe die Browser-Konsole auf Fehler
- Stelle sicher, dass die Supabase Environment Variables korrekt sind