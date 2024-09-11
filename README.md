# OtakuAPI

OtakuAPI is API for otaku, with lots of API, like anime, Donghua films etc.

# Not Included
    Donghua Batch Download
    Anime Batch Page
## Quick Documentation 

| End Point | Params | Description | Example |
| :-- | :-- | :-- | :-- |
| `/v1/anime/home` <br> `/v1/donghua/home`   | `-`  | returns home resources | [`/v1/anime/home`](https://otaku-api.vercel.app/v1/anime/home) <br>  [`/v1/donghua/home`](https://otaku-api.vercel.app/v1/donghua/home) |
| `/v1/anime/ongoing/:page` <br> `/v1/donghua/ongoing/:page`  | - `page` (opt, number) | returns ongoing resources | [`/v1/anime/ongoing/2`](https://otaku-api.vercel.app/v1/anime/ongoing/2) <br> [`/v1/donghua/ongoing/2`](https://otaku-api.vercel.app/v1/donghua/ongoing/2) |
| `/v1/anime/complete/:page` <br> `/v1/donghua/complete/:page` | - `page` (opt, number)  | returns finished resources | [`/v1/anime/complete/1`](https://otaku-api.vercel.app/v1/anime/complete/1) <br> [`/v1/donghua/complete/1`](https://otaku-api.vercel.app/v1/donghua/complete/1) |
| `/v1/anime/search/:keyword` <br> `/v1/donghua/search/:keyword/:page`| - `keyword` (required, string)  <br> - `page` (opt, number)  | returns search results from the given keyword |   [`/v1/anime/search/hibike`](https://otaku-api.vercel.app/v1/hibike/search/hibike) <br> [`/v1/donghua/search/apotheosis`](https://otaku-api.vercel.app/v1/donghua/search/apotheosis) |
| `/v1/anime/slug/:slug` <br> `/v1/donghua/slug/:slug`  | - `slug` (required, string)  | returns single resource | [`/v1/anime/slug/ookami-koushinryou-2024-sub-indo`](https://otaku-api.vercel.app/v1/anime/slug/ookami-koushinryou-2024-sub-indo) <br> [`/v1/donghua/slug/perfect-world`](https://otaku-api.vercel.app/v1/donghua/slug/perfect-world) |
| `/v1/anime/episode/:slug` <br> `/v1/donghua/episode/:slug` | - `slug` (required, string) | returns episode resource (with stream url and download urls) | [`/v1/anime/episode/okmw-episode-7-sub-indo/`](https://otaku-api.vercel.app/v1/anime/episode/okmw-episode-7-sub-indo/) <br> [`/v1/donghua/episode/heavenly-brick-knight-episode-3-indonesia-english-sub/`](https://otaku-api.vercel.app/v1/donghua/episode/heavenly-brick-knight-episode-3-indonesia-english-sub/) |
| `/v1/anime/genres` <br> `/v1/donghua/genres` | - | returns genre lists resource | [`/v1/anime/genres`](https://otaku-api.vercel.app/v1/anime/genres) <br> [`/v1/donghua/genres`](https://otaku-api.vercel.app/v1/donghua/genres) |
| `/v1/anime/genres/:slug/:page` <br> `/v1/donghua/genres/:slug/:page` | - `slug` (required, string) <br>  - `page` (opt, number) | returns lists by the genre's slug | [`/v1/donghua/genres/action/1`](https://otaku-api.vercel.app/v1/anime/genres/action/1) <br> [`/v1/donghua/genres/action/1`](https://otaku-api.vercel.app/v1/donghua/genres/action/1) |

## Response Example
> response for `/v1/donghua/episode/heavenly-brick-knight-episode-3-indonesia-english-sub/`
```json5
{
  "status": "Ok",
  "data": {
    "episode": "Heavenly Brick Knight Episode 3 Indonesia, English Sub",
    "stream_url": "",
    "download_url": {
      "download_url_id": "",
      "download_url_en": ""
    },
    "donghua": {
      "title": "Heavenly Brick Knight",
      "slug": "heavenly-brick-knight/",
      "rating": "Rating 0.0",
      "status": "Ongoing",
      "studio": "Tang Kirin Culture",
      "released": "Jun 13, 2024",
      "country": "China",
      "season": "Summer 2024",
      "type": "ONA",
      "episode_count": "18",
      "platform": "iQiYi",
      "synopsis": "Heavenly Brick Knight\nLi Ji, a cold and arrogant genius student in the Department of Architecture",
      "genres": [
        {
          "name": "Action",
          "slug": "action",
        }
        {
          "name": "Fantasy",
          "slug": "fantasy",
        }
        {
          "name": "Isekai",
          "slug": "isekai",
        }
      ]
    },
    "pagination": {
      "page": "heavenly-brick-knight/",
      "previous_page": "heavenly-brick-knight-episode-2-indonesia-english-sub/",
      "next_page": "heavenly-brick-knight-episode-4-indonesia-english-sub/"
    },
    "episodes_list": [
      {
        "episode": "Heavenly Brick Knight Episode 4 Indonesia, English Sub",
        "slug": "heavenly-brick-knight-episode-4-indonesia-english-sub",
      },
      {
        "episode": "Heavenly Brick Knight Episode 3 Indonesia, English Sub",
        "slug": "heavenly-brick-knight-episode-3-indonesia-english-sub",
      },
      {
        "episode": "Heavenly Brick Knight Episode 2 Indonesia, English Sub",
        "slug": "heavenly-brick-knight-episode-2-indonesia-english-sub",
      },
      {
        "episode": "Heavenly Brick Knight Episode 1 Indonesia, English Sub",
        "slug": "heavenly-brick-knight-episode-1-indonesia-english-sub",
      }
    ],
    "recommendations": [
      {
        "title": "Tales of Demons and Gods Season 8",
        "slug": "animetales-of-demons-and-gods-season-8/",
        "poster": "",
        "type": "ONA",
      }
    ]
  }
}
```

### Installation & Configuration
> note: run the command without the `$` symbol

- Open up your terminal, then run this command to clone this repo
```bash
$ git clone hhttps://github.com/NPMA7/OtakuAPI.git.
```

- Then cd into the project root directory 
```bash
$ cd OtakuAPI
```

- Inside the project root directory, run this command to install all the dependencies
```bash
$ npm install
``` 

- To run a development server, run
```bash
$ npm run start
```
- The server accessible from a browser on `http://localhost:4444`

