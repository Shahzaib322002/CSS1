import { AnimeParser, Anime } from "mangayomi-extensions";

class HentaiHaven extends AnimeParser {
    constructor() {
        super();
        this.name = "HentaiHaven";
        this.baseUrl = "https://hentaihaven.xxx";
        this.lang = "en";
        this.supportsLatest = true;
    }

    async popularAnime(page = 1) {
        const url = `${this.baseUrl}/hentai/page/${page}/`;
        const response = await this.fetchHtml(url);
        const $ = this.cheerio.load(response);

        const animeList = [];
        $("div.item").each((i, element) => {
            const title = $(element).find("h3 a").text();
            const thumbnail = $(element).find("img").attr("src");
            const url = $(element).find("h3 a").attr("href");

            animeList.push(new Anime({
                title,
                url,
                thumbnail
            }));
        });

        const hasNextPage = $("a.next").length > 0;
        return { anime: animeList, hasNextPage };
    }

    async latestAnime(page = 1) {
        return this.popularAnime(page);
    }

    async searchAnime(query, page = 1) {
        const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
        const response = await this.fetchHtml(url);
        const $ = this.cheerio.load(response);

        const animeList = [];
        $("div.item").each((i, element) => {
            const title = $(element).find("h3 a").text();
            const thumbnail = $(element).find("img").attr("src");
            const url = $(element).find("h3 a").attr("href");

            animeList.push(new Anime({
                title,
                url,
                thumbnail
            }));
        });

        return { anime: animeList, hasNextPage: false };
    }

    async fetchEpisodes(animeUrl) {
        const response = await this.fetchHtml(animeUrl);
        const $ = this.cheerio.load(response);

        const episodes = [];
        $("li.wp-manga-chapter").each((index, element) => {
            const episodeTitle = $(element).find("a").text();
            const episodeUrl = $(element).find("a").attr("href");

            episodes.push({
                title: episodeTitle,
                url: episodeUrl,
                episodeNumber: index + 1
            });
        });

        return episodes;
    }

    async fetchVideoUrls(episodeUrl) {
        const response = await this.fetchHtml(episodeUrl);
        const $ = this.cheerio.load(response);

        const videoUrl = $("video source").attr("src");
        if (!videoUrl) return [];

        return [{
            url: videoUrl,
            quality: "Default"
        }];
    }
}

export default new HentaiHaven();
