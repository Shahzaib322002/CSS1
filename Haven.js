const mangayomiSources = [{
    "name": "HentaiHaven",
    "lang": "en",
    "baseUrl": "https://hentaihaven.xxx",
    "apiUrl": "",
    "iconUrl": "https://raw.githubusercontent.com/kodjodevf/mangayomi-extensions/main/javascript/icon/en.allanime.png",
    "typeSource": "single",
    "itemType": 1,
    "isNsfw": false,
    "version": "0.0.35",
    "dateFormat": "",
    "dateFormatLocale": "",
    "pkgPath": "anime/src/en/Haven.js"
}];
 async fetchPopularAnime(page = 1) {
        const url = `${this.baseUrl}/hentai/page/${page}/`;
        const response = await this.fetchHtml(url);
        const $ = this.cheerio.load(response);

        const results = [];
        $("div.item").each((_, element) => {
            results.push({
                title: $(element).find("h3 a").text(),
                url: $(element).find("h3 a").attr("href"),
                thumbnail: $(element).find("img").attr("src"),
            });
        });

        return new FetchResult(results, $("a.next").length > 0);
    }

    async fetchLatestAnime(page = 1) {
        return this.fetchPopularAnime(page);
    }

    async searchAnime(query) {
        const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
        const response = await this.fetchHtml(url);
        const $ = this.cheerio.load(response);

        const results = [];
        $("div.item").each((_, element) => {
            results.push({
                title: $(element).find("h3 a").text(),
                url: $(element).find("h3 a").attr("href"),
                thumbnail: $(element).find("img").attr("src"),
            });
        });

        return new FetchResult(results, false);
    }

    async fetchEpisodes(animeUrl) {
        const response = await this.fetchHtml(animeUrl);
        const $ = this.cheerio.load(response);

        const episodes = [];
        $("li.wp-manga-chapter").each((index, element) => {
            episodes.push({
                title: $(element).find("a").text().trim(),
                url: $(element).find("a").attr("href"),
                episodeNumber: index + 1,
            });
        });

        return episodes;
    }

    async fetchVideoUrls(episodeUrl) {
        const response = await this.fetchHtml(episodeUrl);
        const $ = this.cheerio.load(response);

        const videoUrl = $("video source").attr("src");
        return videoUrl ? [{ url: videoUrl, quality: "Default" }] : [];
    }
}
