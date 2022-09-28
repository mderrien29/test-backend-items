#  Consignes

Le but de ce test est de réaliser une API Rest. Il est calibré pour vous prendre entre 1h à 2h - hors bonus et hors lecture des consignes.

Vous pouvez utiliser le langage/framework de votre choix. Si vous souhaitez vous inspirer de notre stack interne, elle est décrite en annexe.

**Un test fait avec soin, et ne contenant que le minimum attendu sera plus apprécié qu'un test fait avec tous les bonus mais bâclé.**

## Pré-requis

- Postman ou Newman

## Comment lancer les tests

Dans l'interface de Postman, executer une requête execute également les tests. Il existe un onglet Test permettant de consulter les tests, et un onglet Tests results.

En ligne de commande:

```sh
$(npm bin)/newman run test.postman_collection.json
```

## Ce qui est attendu

- serveur HTTP (routes : POST /v1/categories, POST /v1/sales, GET & POST /v1/items)
- validation des données reçues (au minimum pour la route POST /v1/items)
- sauvegarde des données reçues
- filtres pour requêter les données
- header Content-Range
- linter

## Les Bonus

- (+++) Tests (Autres que Postman)
- (+++) Docker 
- (++)  Introduire un Varnish ou équivalent (avec pilotage du cache par header)
- (+)   Implémenter un filtre avec recherche fulltext (et pourquoi pas support des opérateurs "", -, *)
- (+)   Introduction de nouvelles entités organisation OU vente avec relation type clé étrangère dans items

## Annexes

### La stack chez Interencheres

Les langages:

- 70% de NodeJS
- 30% de PHP

Les frameworks:

- Express
- Symfony
- Laravel

Les outils/services:

- JSON Schema
- Docker
- Varnish
- PostgreSQL
- MySQL
- ElasticSearch
- REDIS
- SQS
- SES

### Exemple d'un item valide

⚠️ Attention, l'item qu'on vous envoie ne contient pas de propriété `last_updated`, c'est à vous de la créer et de la maintenir.

```json
{
    "id": 1,
    "category": {
        "id": 1,
        "name": "Vente de mobilier courant",
        "summary": "Chineur invétéré ou novice, les ventes courantes vous offrent une variété de lots à des prix accessibles."
    },
    "sale": {
        "id": 1,
        "name": "BROCANTE - VENTE UNIQUEMENT EN LIVE"
    },
    "description": "Affiche \"Automobilia\" le nouveau record du monde de l'heure , \r\nCastrol sur voiture Bugatti",
    "auction_type": "live",
    "pricing": {
        "estimates": {
            "max": 500,
            "min": 300,
            "currency": "euro"
        }
    },
    "last_updated": "2021-11-15T12:10:46.120Z",
}
```