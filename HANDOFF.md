# ASKAAN - Passation projet

## 1. Objectif

ASKAAN 221 est une plateforme sénégalaise de collecte de fonds, déployée sur Vercel et prévue pour fonctionner avec Supabase/PostgreSQL.

La règle produit importante : aucune campagne fictive ne doit être affichée en production. Les campagnes publiques doivent venir de Supabase et être au statut `published`.

## 2. URLs et dépôts

- Site de production canonique : https://askaan.vercel.app
- Dépôt GitHub : https://github.com/papesambagueye/askaan
- Branche de production : `main`
- Projet Supabase : `askaan`
- Supabase URL : `https://wdttzwxopvkjnrfeirsc.supabase.co`
- Projet Vercel : `papisgye05-7633s-projects/askaan`

Les URLs Vercel longues de type `askaan-...-projects.vercel.app` sont des déploiements immuables. Elles peuvent continuer à afficher une ancienne version. Toujours vérifier `https://askaan.vercel.app`.

## 3. Comptes et permissions

### GitHub

- Compte communiqué : `papisgye05@gmail.com`
- Repository : `papesambagueye/askaan`
- Ne jamais demander ni enregistrer un mot de passe ou un token dans le dépôt.

### Supabase

Variables nécessaires dans Vercel :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (type Secret uniquement)

La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être mise dans le code, `.env.example`, GitHub ou une réponse utilisateur.

Rôles en base :

- `user` : utilisateur normal, peut soumettre ses campagnes.
- `admin` : peut gérer/valider les campagnes selon les politiques RLS.
- `super_admin` : peut créer les comptes admin via `/api/admin/users`.

Le trigger `handle_new_user` est configuré dans Supabase : le premier compte créé alors qu'aucun profil n'existe reçoit `super_admin`; les suivants reçoivent `user`.

Attention : si un profil existe déjà, il faut promouvoir explicitement le bon compte avec une requête SQL sécurisée dans Supabase, sans exposer de secret.

## 4. Ce qui est déjà fait

- Next.js App Router + TypeScript + Tailwind.
- Déploiement Vercel relié à GitHub avec déploiement automatique depuis `main`.
- SEO : metadata, mots-clés ASKAAN 221, Open Graph, sitemap, robots, données structurées JSON-LD.
- PWA : manifeste et icône.
- Supabase : tables `profiles`, `campaigns`, `donations`, `campaign_updates`.
- Supabase : enum de rôles et statuts de campagne.
- Supabase : RLS, fonctions `is_admin`, `is_super_admin`, trigger de création de profil.
- Supabase : bucket `campaign-images`.
- Supabase : vue `campaign_public_stats` calculant les montants confirmés et les contributeurs.
- API : soumission de campagne, listing admin, validation/rejet, création d'admin.
- Page publique : aucune donnée de démonstration dans le code actuel; état vide explicite si aucune campagne publiée.
- Page campagne : montant basé sur les dons `confirmed` et journal public de transparence.
- Accès admin masqué : triple clic sur le logo en haut à gauche ou triple clic sur le cercle jaune en bas à droite.
- Le dashboard reste protégé par la session Supabase et le rôle en base.

## 5. Ce qui reste à faire

- Tester la création du premier compte réel dans Supabase et confirmer son rôle `super_admin`.
- Tester la connexion `/connexion` et l'accès `/admin` avec ce compte.
- Tester la soumission d'une campagne réelle, sa validation admin puis son affichage public.
- Ajouter dans le dashboard admin l'interface complète de création/suspension d'admins et de gestion des mises à jour de transparence.
- Ajouter une vraie réception de dons ou un workflow de saisie/vérification des dons Wave/Orange Money. Les liens de paiement externes ne permettent pas de détecter automatiquement un paiement.
- Ajouter les variables Vercel en Preview/Development si nécessaire, en plus de Production.
- Vérifier que le dernier déploiement associé au commit `75c473b` est `Ready` sur Vercel.
- Google Search Console et domaine personnalisé à configurer si le référencement de `ASKAAN 221` devient prioritaire.

## 6. Structure utile

- `src/app/page.tsx` : accueil public, campagnes Supabase uniquement.
- `src/app/creer/page.tsx` : formulaire de soumission connecté à `/api/campaigns`.
- `src/app/connexion/page.tsx` : connexion Supabase.
- `src/app/admin/page.tsx` : dashboard admin et validation.
- `src/app/campagne/[id]/page.tsx` : détail, progression et journal de transparence.
- `src/app/api/campaigns/route.ts` : création de campagne authentifiée.
- `src/app/api/admin/campaigns/route.ts` : listing admin.
- `src/app/api/admin/campaigns/[id]/route.ts` : validation/rejet.
- `src/app/api/admin/users/route.ts` : création d'admin réservée au super admin.
- `src/lib/campaigns.ts` : lectures Supabase et calculs publics.
- `src/lib/supabase/` : clients browser, server et service role.
- `supabase/schema.sql` : schéma de référence et politiques RLS.
- `src/components/AdminSecretAccess.tsx` : triple-clic admin.

## 7. Protocole obligatoire après chaque modification

1. Lire les fichiers concernés et vérifier les changements existants; ne jamais écraser les changements utilisateur.
2. Faire le changement minimal avec `apply_patch` ou un nouvel outil de création de fichier.
3. Lancer immédiatement un contrôle ciblé : `get_errors` puis le test/build le plus proche.
4. Lancer le build depuis le bon dossier, avec un chemin absolu si le terminal est déjà dans `ASKAAN-app` :

```powershell
Set-Location 'C:\Users\Papis\Desktop\ASKAAN\ASKAAN-app'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run build
```

5. Vérifier le site de production sur `https://askaan.vercel.app`, pas sur une URL de déploiement historique.
6. Vérifier `git status` et ne committer que les fichiers attendus.
7. Committer avec un message clair, puis pousser sur `main` :

```powershell
git add .
git commit -m "description courte"
git push origin main
```

8. Vérifier dans Vercel que le nouveau déploiement est `Ready`.
9. Si une migration SQL est nécessaire, l'exécuter dans le SQL Editor Supabase et vérifier `Success. No rows returned`.
10. Ne jamais afficher de clé Supabase, token, mot de passe ou valeur secrète dans le chat, les logs, les commits ou la documentation.

## 8. Pièges connus

- Ne pas exécuter `Set-Location .\ASKAAN-app` si le terminal est déjà dans `C:\Users\Papis\Desktop\ASKAAN\ASKAAN-app`; cela produit le faux chemin `ASKAAN-app\\ASKAAN-app`.
- Un ancien déploiement Vercel peut afficher des campagnes fictives même après correction. Contrôler le domaine canonique et le commit du déploiement.
- Une variable Vercel `SUPABASE_SERVICE_ROLE_KEY` de type Config est incorrecte : elle doit être de type Secret.
- Les liens Wave/Orange Money sont externes; sans webhook ou saisie vérifiée, ASKAAN ne peut pas connaître automatiquement le montant payé.
- Ne jamais réintroduire `src/lib/data.ts` avec des campagnes de démonstration.
