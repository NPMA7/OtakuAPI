# OtakuAPI

OtakuAPI is API for otaku, with lots of API, like anime, Donghua films etc

## Quick Documentation 

| End Point | Method | Params | Description | Example |
| :-- | :-- | :-- | :-- | :-- |
| `/v1/donghua/home` | `GET` | `-`  | returns home resources | [`/v1/donghua/home`](https://otaku-api.vercel.app/v1/donghua/home) |
| `/v1/donghua/ongoing/:page` | `GET` | - `page` (opt, number) | returns ongoing resources | [`/v1/donghua/ongoing/2`](https://otaku-api.vercel.app/v1/donghua/ongoing/2) |
| `/v1/donghua/complete/:page` | `GET` | - `page` (opt, number)  | returns finished resources | [`/v1/donghua/complete/1`](https://otaku-api.vercel.app/v1/donghua/complete/1) |
| `/v1/donghua/search/:keyword/:page` | `GET` | - `keyword` (required, string)  <br> - `episode` (required, number)  | returns search results from the given keyword | [`/v1/donghua/search/apotheosis`](https://otaku-api.vercel.app/v1/donghua/search/apotheosis) |
| `/v1/donghua/slug/:slug` | `GET` | - `slug` (required, string)  | returns single resource | [`/v1/donghua/slug/perfect-world`](https://otaku-api.vercel.app/v1/donghua/slug/perfect-world) |
| `/v1/donghua/episode/:slug` | `GET` | - `slug` (required, string) | returns episode resource (with stream url and download urls) | [`/v1/donghua/episode/heavenly-brick-knight-episode-3-indonesia-english-sub/`](https://otaku-api.vercel.app/v1/donghua/episode/heavenly-brick-knight-episode-3-indonesia-english-sub/) |
| `/v1/donghua/genres` | `GET` | - | returns genre lists resource | [`/v1/donghua/genres`](https://otaku-api.vercel.app/v1/donghua/genres) |
| `/v1/donghua/genres/:slug/:page` | `GET` | - `slug` (required, string) <br>  - `page` (opt, number) | returns lists by the genre's slug | [`/v1/donghua/genres/action/1`](https://otaku-api.vercel.app/v1/donghua/genres/action/1) |

## Response Example
> response for `/v1/donghua/episode/heavenly-brick-knight-episode-3-indonesia-english-sub/`
```json5
{
    "status": "Ok",
    "data": {
        "episode": "Heavenly Brick Knight Episode 4 Indonesia, English Sub",
        "stream_url": "//ok.ru/videoembed/7662909655604",
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
            "synopsis": "Heavenly Brick Knight\nLi Ji, a cold and arrogant genius student in the Department of Architecture, is kidnapped by the alien creature Dark Qilin and taken to a secret realm called the Po Nian Room. The secret realm contains the ruins of an ancient heaven. Dark Qilin told him that he had to go through it if he wanted to return. The test of heaven and this test is to rebuild heaven.\n\nIndonesia\n\nLi Ji, seorang mahasiswa jenius yang dingin dan sombong di Jurusan Arsitektur, diculik oleh makhluk asing Dark Qilin dan dibawa ke alam rahasia bernama Ruang Po Nian. Alam rahasia berisi reruntuhan surga kuno. Dark Qilin memberitahunya bahwa dia harus melewatinya jika dia ingin kembali. Ujian surga dan ujian ini adalah untuk membangun kembali surga.\n\nHeavenly Brick Knight Subtitle indonesia, english, portuguese, turkish, spanish, italian, polish, arabic, thai, german",
            "genres": [
                {
                    "name": "Action",
                    "slug": "action",
                },
                {
                    "name": "Fantasy",
                    "slug": "fantasy",
                },
                {
                    "name": "Isekai",
                    "slug": "isekai",   
                }
            ]
        },
        "pagination": {
            "page": "heavenly-brick-knight/",
            "previous_page": "heavenly-brick-knight-episode-3-indonesia-english-sub/",
            "next_page": null
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
        "download_url": {
            "download_url_id": "https://sfl.gl/v8UGcKeg",
            "download_url_en": "https://sfl.gl/3DqAI"
        },
        "recommendations": [
            {
                "title": "Heavenly Brick Knight Episode 3 Indonesia, English Sub",
                "slug": "https:/anichin.co.id/heavenly-brick-knight-episode-3-indonesia-english-sub/",
                "type": "",
            },
            {
                "title": "Heavenly Brick Knight Episode 3 Indonesia, English Sub",
                "slug": "https:/anichin.co.id/heavenly-brick-knight-episode-3-indonesia-english-sub/",
                "type": "",
            },
            {
                "title": "Supreme God Emperor",
                "slug": "supreme-god-emperor",
                "poster": "https://anichin.co.id/wp-content/uploads/2023/11/1699062269-2925-114920.webp",
                "type": "ONA",
            },
            {
                "title": "Against the Gods",
                "slug": "against-the-gods",
                "poster": "https://anichin.co.id/wp-content/uploads/2023/12/against-the-god.webp",
                "type": "OVA",
            },
            {
                "title": "Wu Dong Qian Kun 4th Season",
                "slug": "wu-dong-qian-kun-4th-season",
                "poster": "https://anichin.co.id/wp-content/uploads/2023/11/1701057691-1817-139679.webp",
                "type": "ONA",                
            },
            {
                "title": "I Pick Up Lot of Attributes",
                "slug": "i-pick-up-lot-of-attributes",
                "poster": "https://anichin.co.id/wp-content/uploads/2023/11/1699562625-9831-126821.jpg",
                "type": "ONA",                
            },
            {
                "title": "Immortality Season 3",
                "slug": "immortality-season-3",
                "poster": "https://anichin.co.id/wp-content/uploads/2024/04/immortality-s3.jpg",
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

