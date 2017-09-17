const request = require("request")
const cheerio = require("cheerio")

// finds title in the DOM passed
const findTitleInDom = ($dom) => {
    return $dom("meta[property='og:title']").attr("content") ||
		$dom("title").text() ||
		$dom("meta[name=title]").attr("content");
}

// finds description in the DOM passed
const findDescriptionInDom = ($dom) => {
    return $dom("meta[property='og:description']").attr("content") ||
		$dom("meta[name=description]").attr("content") ||
		$dom("div .description").text();
}

// finds image in the DOM passed
const findImageInDom = ($dom) => {
    var imageSrc = $dom("meta[property='og:image']").attr("content") ||
		$dom("meta[itemprop=image]").attr("content") ||
		$dom("link[rel=image_src]").attr("content") ||
		$dom("img").attr("src")
    return imageSrc;
}

// const validateUrl = (value) => (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9:%._\+~#=^@]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9:%_\+.~#?&//=^@]*)/g).test(value)

const generatePreview = (url, tags, type, callback) => {
    // fetches the provided url
    request(url, function(error, response, body) {
        if (!error) {
            const $dom = cheerio.load(body)
            const descr = findDescriptionInDom($dom)
            const title = findTitleInDom($dom)
            let img = findImageInDom($dom)
            img = img ? img : url.endsWith("/") ? url+"favicon.ico" : url+"/favicon.ico"

            const icon =    type === "interactive" ?
                            "fa-puzzle-piece" :
                            type === "book" ?
                            "fa-book" :
                            type === "article" ?
                            "fa-pencil" :
                            type === "course" ?
                            "fa-graduation-cap" :
                            type === "wiki" ?
                            "fa-wikipedia-w" :
                            type === "repo" ?
                            "fa-github" :
                            type === "list" ?
                            "fa-list" :
                            type === "video" ?
                            "fa-youtube" :
                            type === "paper" ?
                            "fa-file-text-o" :
                            type === "podcast" ?
                            "fa-microphone" :
                            type === "quora" ?
                            "fa-quora" :
                            type === "stack-ex" ?
                            "fa-stack-exchange" :
                            type === "stack-ov" ?
                            "fa-stack-overflow" :
                            type === "image" ?
                            "fa-picture-o" :
                            type === "generic" ?
                            "fa-link" :
                            "fa-link"

            const html = `<div class="linkPreviewContainer">
                <a href="${url}" data-href="${url}" title="${url}" rel="nofollow" target="_blank" class="linkPreviewText">
                    <strong><i class="fa ${icon}" aria-hidden="true"></i>&nbsp;${title}</strong><br>
                    <em>${tags.map(tag => `<span class="tag"style="background-color:${tag.color}">${tag.text}</span>`).join("")}</em><br>
                    <em>${descr}</em>${url}</a>
                <a
                    href="${url}" class="linkPreviewImage" target="_blank" style="background-image: url(${img});"></a>
            </div>`

            callback(html)
        } else {
            // if the fetch fails (no internet connection or dead link) return a plain link
            callback(`<a target="_blank" href="${url}">${url}</a>`)
        }
    });
}

module.exports = generatePreview
