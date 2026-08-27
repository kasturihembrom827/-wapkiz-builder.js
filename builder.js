/* ========================= TMDB CONFIG & GLOBALS ========================= */
var tmdbDirector = "";
var tmdbRating = "";
var tmdbVoteCount = "";
var tmdbProduction = "";

// External PHP Proxy URL (Apna Free Hosting / Render Link Yahan Change Karein)
var PROXY_URL = "https://your-free-hosting-domain.com/tmdb-proxy.php";

/* ========================= HELPER FUNCTIONS ========================= */
function getField(name) {
    return document.querySelector('[name="' + name + '"]');
}
function getValue(name) {
    var el = getField(name);
    return el ? String(el.value || "").trim() : "";
}
function setValue(name, value) {
    var el = getField(name);
    if (el) el.value = value || "";
}
function makeSlug(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function getYear(date) {
    if (!date) return "";
    var match = String(date).match(/\d{4}/);
    return match ? match[0] : "";
}
function formatNumber(num) {
    if (!num) return "";
    return Number(num).toLocaleString("en-IN");
}
async function tmdbFetch(url) {
    var response = await fetch(url);
    if (!response.ok) {
        throw new Error("TMDB Error: " + response.status);
    }
    return await response.json();
}

/* ========================= DYNAMIC EXTRA LINKS ========================= */
function addMoreLinkField() {
    var container = document.getElementById("extraLinksContainer");
    if (!container) return;
    var div = document.createElement("div");
    div.className = "catlist extra-link-row";
    div.style.marginBottom = "8px";
    div.innerHTML =
        '<input type="text" class="extra-name" style="width:70px; margin-right:4px;" placeholder="Ep / Label"/>' +
        '<input type="text" class="extra-url" style="width:140px; margin-right:4px;" placeholder="Download Link"/>' +
        '<input type="text" class="extra-size" style="width:60px; margin-right:4px;" placeholder="Size"/>' +
        '<button type="button" onclick="this.parentElement.remove();" style="background:#ff4d4d; color:#fff; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">✖</button>';
    container.appendChild(div);
}

/* ========================= TOGGLE FIELDS ========================= */
function toggleSeriesAndOttFields() {
    var typeEl = getField("type");
    var sBlock = document.getElementById("seriesBlock");
    var ottBlock = document.getElementById("ottBlock");
    var isSeries = typeEl && typeEl.value === "series";
    if (sBlock) sBlock.style.display = isSeries ? "block" : "none";
    if (ottBlock) ottBlock.style.display = isSeries ? "block" : "none";
}

/* ========================= AUTO LINK GENERATOR ========================= */
function autoGenerateLinks() {
    var masterEl = document.getElementById("masterLink");
    var sizeEl = document.getElementById("masterSize");
    if (!masterEl || !masterEl.value.trim()) {
        alert("Kripya Master Direct Link dalein!");
        return;
    }
    var master = masterEl.value.trim();
    var baseSize = sizeEl && sizeEl.value.trim() ? sizeEl.value.trim() : "";
    var qualities = [
        { check: "gen480", link: "link1", size: "size1", defaultSize: baseSize || "450MB" },
        { check: "gen720", link: "link2", size: "size2", defaultSize: "950MB" },
        { check: "gen1080", link: "link3", size: "size3", defaultSize: "2.1GB" },
        { check: "gen4k", link: "link4", size: "size4", defaultSize: "5.5GB" }
    ];
    qualities.forEach(function(item) {
        var check = document.getElementById(item.check);
        var link = getField(item.link);
        var size = getField(item.size);
        if (check && check.checked) {
            if (link) link.value = master;
            if (size) {
                size.value = (item.check === "gen480" && baseSize) ? baseSize : item.defaultSize;
            }
        }
    });
    alert("Multi-Quality Links Auto-Filled!");
}

/* ========================= FIXED TITLE GENERATOR ========================= */
function updateMovieTitle(title, year, isSeries, lang) {
    var blogTitleEl = getField("blog_title");
    var typeEl = getField("type");
    var qltEl = getField("qlt");
    if (!blogTitleEl) return;
    var quality = qltEl ? qltEl.value : "HDRip";
    var audioFormat = getValue("audio_format");
    var audioTag = "";
    if (audioFormat) {
        audioTag = audioFormat;
    } else if (lang === "Hindi") {
        audioTag = "Hindi Org Audio";
    } else {
        audioTag = "Dual Audio " + lang + "-Hindi";
    }
    if (isSeries) {
        if (typeEl) typeEl.value = "series";
        var season = getValue("season_num") || "Season 01";
        blogTitleEl.value = title + " (" + year + ") " + season + " [" + audioTag + "] " + quality + " Download";
    } else {
        if (typeEl) typeEl.value = "movie";
        blogTitleEl.value = title + " (" + year + ") Full Movie [" + audioTag + "] " + quality + " Download";
    }
}

/* ========================= MAPS & OTT DETECTOR ========================= */
var langMap = {
    "hi": "Hindi", "en": "English", "ta": "Tamil", "te": "Telugu",
    "ml": "Malayalam", "kn": "Kannada", "bn": "Bengali", "mr": "Marathi",
    "pa": "Punjabi", "gu": "Gujarati", "ja": "Japanese", "ko": "Korean",
    "zh": "Chinese", "es": "Spanish", "fr": "French", "de": "German"
};

function normalizeOTT(providerName) {
    if (!providerName) return "Other";
    var name = providerName.toLowerCase();
    if (name.indexOf("netflix") > -1) return "Netflix";
    if (name.indexOf("amazon") > -1 || name.indexOf("prime") > -1) return "Prime Video";
    if (name.indexOf("hotstar") > -1 || name.indexOf("jio") > -1) return "JioHotstar";
    if (name.indexOf("zee5") > -1 || name.indexOf("zee") > -1) return "ZEE5";
    if (name.indexOf("sony") > -1 || name.indexOf("liv") > -1) return "SonyLIV";
    return "Other";
}

/* ========================= TMDB FETCH (SECURE PROXY) ========================= */
async function fetchTMDB() {
    var movieInput = document.getElementById("tmdbMovie");
    if (!movieInput || !movieInput.value.trim()) {
        alert("Enter Movie / Web Series Name");
        return;
    }
    var query = movieInput.value.trim();
    try {
        var typeEl = getField("type");
        var isSeries = typeEl ? (typeEl.value === "series") : false;
        var primaryType = isSeries ? "tv" : "movie";
        var secondaryType = isSeries ? "movie" : "tv";

        var searchData = await tmdbFetch(PROXY_URL + "?action=search&type=" + primaryType + "&query=" + encodeURIComponent(query));
        var actualType = primaryType;

        if (!searchData.results || searchData.results.length === 0) {
            searchData = await tmdbFetch(PROXY_URL + "?action=search&type=" + secondaryType + "&query=" + encodeURIComponent(query));
            actualType = secondaryType;
        }
        if (!searchData.results || searchData.results.length === 0) {
            alert("Movie / Web Series Not Found");
            return;
        }

        var m = searchData.results[0];
        isSeries = (actualType === "tv");
        var title = isSeries ? (m.name || m.original_name) : (m.title || m.original_title);
        var release = isSeries ? m.first_air_date : m.release_date;
        var year = getYear(release);

        if (typeEl) typeEl.value = isSeries ? "series" : "movie";
        toggleSeriesAndOttFields();
        setValue("poster", m.poster_path ? "https://image.tmdb.org/t/p/w500" + m.poster_path : "");
        setValue("des", m.overview || "");
        setValue("date", release || "");
        if (isSeries) setValue("ott_date", release || "");

        /* FULL DETAILS */
        var d = await tmdbFetch(PROXY_URL + "?action=details&type=" + actualType + "&id=" + m.id);
        tmdbRating = d.vote_average ? Number(d.vote_average).toFixed(1) : "";
        tmdbVoteCount = d.vote_count || "";
        if (d.genres) setValue("genre", d.genres.map(function(g) { return g.name; }).join(", "));
        var lang = d.original_language ? (langMap[d.original_language] || d.original_language.toUpperCase()) : "Hindi";
        setValue("lng", lang);

        if (!isSeries) {
            if (d.runtime) setValue("dur", d.runtime + " Min");
        } else {
            var seasonEl = getField("season_num");
            var episodeEl = getField("episode_num");
            var runtimeVal = (d.episode_run_time && d.episode_run_time.length) ? d.episode_run_time[0] + " Min / Episode" : "45 Min / Episode";
            if (d.number_of_seasons && seasonEl) seasonEl.value = "Season " + (d.number_of_seasons < 10 ? '0' : '') + d.number_of_seasons;
            if (d.number_of_episodes && episodeEl) episodeEl.value = "Episodes 01-" + d.number_of_episodes;
            setValue("dur", runtimeVal);
            setValue("ep_runtime", runtimeVal);
        }

        /* OTT PROVIDER */
        var ottSelect = getField("ott_platform");
        if (ottSelect) {
            try {
                var providerData = await tmdbFetch(PROXY_URL + "?action=providers&type=" + actualType + "&id=" + m.id);
                var countryData = providerData.results ? (providerData.results.IN || providerData.results.US || null) : null;
                var providers = countryData && countryData.flatrate ? countryData.flatrate : [];
                if (providers.length) ottSelect.value = normalizeOTT(providers[0].provider_name);
            } catch (ottErr) { console.log("OTT Fetch Error: ", ottErr); }
        }

        /* CAST & CREW */
        var creditData = await tmdbFetch(PROXY_URL + "?action=credits&type=" + actualType + "&id=" + m.id);
        if (creditData.cast && creditData.cast.length) {
            setValue("strcast", creditData.cast.slice(0, 10).map(function(c) { return c.name; }).join(", "));
        }
        tmdbDirector = "";
        if (creditData.crew) {
            var director = creditData.crew.find(function(c) { return c.job === "Director" || c.job === "Executive Producer"; });
            if (director) tmdbDirector = director.name;
        }

        /* TRAILER */
        try {
            var videoData = await tmdbFetch(PROXY_URL + "?action=videos&type=" + actualType + "&id=" + m.id);
            var trailerInput = document.getElementById("tmdbTrailer");
            if (videoData.results && trailerInput) {
                var trailerObj = videoData.results.find(function(v) { return v.type === "Trailer" && v.site === "YouTube"; }) || videoData.results[0];
                if (trailerObj && trailerObj.key) trailerInput.value = trailerObj.key;
            }
        } catch (vidErr) { console.log("Trailer Error: ", vidErr); }

        /* SCREENSHOTS */
        try {
            var ssData = await tmdbFetch(PROXY_URL + "?action=images&type=" + actualType + "&id=" + m.id);
            if (ssData.backdrops) {
                var shots = ssData.backdrops.slice(0, 4);
                for (var i = 1; i <= 4; i++) {
                    var ss = getField("ss" + i);
                    if (ss) ss.value = shots[i - 1] ? "https://image.tmdb.org/t/p/w780" + shots[i - 1].file_path : "";
                }
            }
        } catch (imgErr) { console.log("Screenshot Error: ", imgErr); }

        updateMovieTitle(title, year, isSeries, lang);
        var qltEl = getField("qlt");
        var audioEl = getField("audio_format");
        if (qltEl) qltEl.onchange = function() { updateMovieTitle(title, year, isSeries, lang); };
        if (audioEl) audioEl.onchange = function() { updateMovieTitle(title, year, isSeries, lang); };
        alert(isSeries ? "Web Series Data Loaded!" : "Movie Data Loaded!");
    } catch (e) {
        alert("Fetch Failed. Check Console.");
        console.error(e);
    }
}

/* ========================= WAPKIZ POST BUILDER ========================= */
function last(f) {
    if (!f || !f.text) return;
    var qs = '"';
    f.text.value = "";
    var autoDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    var title = getValue("blog_title");
    var schemaId = "schema-data-" + makeSlug(title);
    var isSeries = f.type && f.type.value === 'series';
    var catVal = f.blog_cat ? f.blog_cat.value : "";
    var catText = (f.blog_cat && f.blog_cat.selectedIndex >= 0) ? f.blog_cat.options[f.blog_cat.selectedIndex].text : "Movies";

    /* BREADCRUMB */
    f.text.value += "<div class=" + qs + "breadcrumb" + qs + ">" +
        "<p class=" + qs + "home" + qs + ">" +
        "<a href='/'>Home</a> <font color='red'>»</font> " +
        "<a href='javascript:history.back()'>Back</a> <font color='red'>»</font> " +
        "<a href=" + qs + "/page-movies/" + catVal + "/" + makeSlug(catText) + ".html" + qs + ">" + catText + "</a> <font color='red'>»</font> " +
        title + "</p></div>";

    /* POSTER */
    var poster = getValue("poster") || "https://dummyimage.com/220x260/cccccc/000000&text=No+Image";
    f.text.value += "<p class=" + qs + "showimage" + qs + ">" +
        "<img class=" + qs + "absmiddle" + qs + " src=" + qs + poster + qs + " onerror=" + qs + "this.onerror=null;this.src='https://dummyimage.com/220x260/cccccc/000000&text=No+Image';" + qs + " height=" + qs + "260" + qs + " width=" + qs + "220" + qs + " alt=" + qs + title + qs + " />" +
        "</p>";

    /* CONTENT DETAILS */
    f.text.value += "<h2 class=" + qs + "header" + qs + ">Content Details</h2>" +
        "<div class=" + qs + "description1" + qs + ">" +
        "<div class=" + qs + "catlist" + qs + "><b>Title:</b> <font color=#D2691E>" + title + "</font></div>";
    if (isSeries) {
        if (getValue("season_num")) f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Season & Episodes:</b> <font color=red>" + getValue("season_num") + " (" + (getValue("episode_num") || "All Episodes") + ")</font></div>";
        if (getValue("ep_runtime")) f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Episode Runtime:</b> <font color=#9400D3>" + getValue("ep_runtime") + "</font></div>";
        if (getValue("series_status")) f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Series Status:</b> <font color=#28a745>" + getValue("series_status") + "</font></div>";
        if (getValue("ott_platform")) f.text.value += "<div class=" + qs + "catlist" + qs + "><b>OTT Platform:</b> <font color=#007bff>" + getValue("ott_platform") + "</font></div>";
        if (getValue("ott_date")) f.text.value += "<div class=" + qs + "catlist" + qs + "><b>OTT Release Date:</b> " + getValue("ott_date") + "</div>";
        if (getValue("ott_status")) f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Streaming Status:</b> <font color=#ffc107>" + getValue("ott_status") + "</font></div>";
    }
    f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Audio Format:</b> <font color=#008000>" + (getValue("audio_format") || getValue("lng")) + "</font></div>" +
        "<div class=" + qs + "catlist" + qs + "><b>Subtitles:</b> <font color=#ff6600>" + getValue("subtitle_format") + "</font></div>" +
        "<div class=" + qs + "catlist" + qs + "><b>Genre:</b> <font color=#311DD6>" + getValue("genre") + "</font></div>" +
        "<div class=" + qs + "catlist" + qs + "><b>Category:</b> <a href=" + qs + "/page-movies/" + catVal + "/" + makeSlug(catText) + ".html" + qs + ">" + catText + "</a></div>";
    if (getValue("strcast")) {
        var castLinks = getValue("strcast").split(',').map(function(name) {
            name = name.trim();
            return "<a href='/page-starcast/" + makeSlug(name) + ".html'>" + name + "</a>";
        }).join(', ');
        f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Starcast:</b> <font color=green>" + castLinks + "</font></div>";
    }
    if (!isSeries) {
        f.text.value += "<div class=" + qs + "catlist" + qs + "><b>" + (getValue("date") ? 'Release Date' : 'Post Date') + ":</b> " + (getValue("date") || autoDate) + "</div>";
    }
    f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Duration:</b> <font color=#9400D3>" + getValue("dur") + "</font></div>" +
        "<div class=" + qs + "catlist" + qs + "><b>Quality:</b> <font color=red>" + getValue("qlt") + "</font></div>" +
        "<div class=" + qs + "catlist" + qs + "><b>Language:</b> <font color=green>" + getValue("lng") + "</font></div>";
    if (tmdbRating && tmdbRating !== "0") {
        f.text.value += "<div class=" + qs + "catlist" + qs + "><b>IMDb Rating:</b> ⭐ " + tmdbRating + "/10 (" + formatNumber(tmdbVoteCount) + " Votes)</div>";
    }
    if (tmdbDirector) {
        f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Director:</b> <font color=#008B8B>" + tmdbDirector + "</font></div>";
    }
    f.text.value += "<div class=" + qs + "catlist" + qs + "><b>Description:</b> <font color=#ff0080>" + (getValue("des") || "Description Not Available") + "</font></div></div>";

    /* TRAILER */
    var trailerEl = document.getElementById("tmdbTrailer");
    var trailerKey = trailerEl ? trailerEl.value.trim() : "";
    if (trailerKey !== "") {
        f.text.value += "<h2 class=" + qs + "header" + qs + ">Official Trailer</h2>" +
            "<div class=" + qs + "trailer-box" + qs + " style=" + qs + "position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:10px 0;" + qs + ">" +
            "<iframe src=" + qs + "https://www.youtube.com/embed/" + trailerKey + qs + " style=" + qs + "position:absolute;top:0;left:0;width:100%;height:100%;border:0;" + qs + " allowfullscreen></iframe>" +
            "</div>";
    }

    /* DOWNLOAD LINKS */
    f.text.value += "<h2 class=" + qs + "header" + qs + ">" + title + "</h2><div class=" + qs + "download-center" + qs + ">";
    var names = ['480p / Ep Zip', '720p / Season Zip', '1080p', '4K / HD', 'Server 1', 'Server 2', 'Server 3', 'Server 4'];
    for (var i = 1; i <= 8; i++) {
        var url = getValue("link" + i);
        var size = getValue("size" + i);
        if (!url || url.indexOf("http") !== 0) continue;
        var sizeHTML = size ? "<span class=" + qs + "dl-size" + qs + ">" + size + "</span>" : "";
        f.text.value += "<div class=" + qs + "catRow" + qs + ">" +
            "<a class=" + qs + "touch" + qs + " href=" + qs + "javascript:void(0)" + qs + " onclick=" + qs + "var link='" + url + "';" + "window.open('https://www.effectivecpmnetwork.com/xy7pmh8hm8?key=e93cdf0b6ef0395ba250bef6adabbbbf','_blank');" + "setTimeout(function(){window.open(link,'_blank');},1000);" + "return false;" + qs + ">" +
            "⬇️ Download " + title + " " + names[i - 1] + "<br/>" + sizeHTML +
            "</a></div>";
    }

    /* EXTRA LINKS */
    var extraRows = document.querySelectorAll(".extra-link-row");
    for (var j = 0; j < extraRows.length; j++) {
        var row = extraRows[j];
        var nameInput = row.querySelector(".extra-name");
        var urlInput = row.querySelector(".extra-url");
        var sizeInput = row.querySelector(".extra-size");
        var nameVal = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : "Download";
        var urlVal = urlInput ? urlInput.value.trim() : "";
        var sizeVal = sizeInput ? sizeInput.value.trim() : "";
        if (urlVal && urlVal.indexOf("http") === 0) {
            var extraSizeHTML = sizeVal ? "<span class=" + qs + "dl-size" + qs + ">" + sizeVal + "</span>" : "";
            f.text.value += "<div class=" + qs + "catRow" + qs + ">" +
                "<a class=" + qs + "touch" + qs + " href=" + qs + "javascript:void(0)" + qs + " onclick=" + qs + "var link='" + urlVal + "';" + "window.open('https://www.effectivecpmnetwork.com/xy7pmh8hm8?key=e93cdf0b6ef0395ba250bef6adabbbbf','_blank');" + "setTimeout(function(){window.open(link,'_blank');},1000);" + "return false;" + qs + ">" +
                "⬇️ Download " + title + " " + nameVal + "<br/>" + extraSizeHTML +
                "</a></div>";
        }
    }
    f.text.value += "</div>";

    /* SCREENSHOTS */
    var screenshotHTML = "";
    for (var s = 1; s <= 4; s++) {
        var imgUrl = getValue("ss" + s);
        if (imgUrl) {
            screenshotHTML += "<img class=" + qs + "screen-img" + qs + " src=" + qs + imgUrl + qs + " loading=" + qs + "lazy" + qs + " />";
        }
    }
    if (screenshotHTML !== "") {
        f.text.value += "<h2 class=" + qs + "header" + qs + ">Screenshots</h2><div class=" + qs + "screens-wrapper" + qs + ">" + screenshotHTML + "</div>";
    }

    /* TRENDING TAGS */
    var genreFirst = getValue("genre") ? getValue("genre").split(",")[0].trim() : "";
    var yearVal = getYear(getValue("date"));
    var actorFirst = getValue("strcast") ? getValue("strcast").split(",")[0].trim() : "";
    var searchTags = [
        title + " Download", title + " Full Movie", title + " Watch Online",
        title + " Trailer", title + " HD Movie", title + " 480p Download",
        title + " 720p Download", title + " 1080p Download", title + " " + getValue("lng"),
        title + " " + getValue("qlt"), title + " " + yearVal, title + " " + genreFirst + " Movie",
        title + " Direct Download"
    ];
    if (actorFirst) {
        searchTags.push(actorFirst + " Movies");
        searchTags.push(title + " " + actorFirst);
    }
    var added = {};
    var trendingHTML = "<h2 class=" + qs + "header" + qs + ">Trending Searches</h2><div class=" + qs + "trendingBox" + qs + ">";
    for (var k = 0; k < searchTags.length; k++) {
        var tag = (searchTags[k] || "").trim();
        if (tag.length < 2) continue;
        var key = tag.toLowerCase();
        if (added[key]) continue;
        added[key] = true;
        trendingHTML += "<a class=" + qs + "tagbtn" + qs + " href='/page-search/" + encodeURIComponent(tag) + ".html'>" + tag + "</a>";
    }
    trendingHTML += "</div>";
    f.text.value += trendingHTML;

    /* JSON-LD SCHEMA */
    var cleanDesc = getValue("des") ? getValue("des").replace(/"/g, "'").replace(/\n/g, ' ') : 'Description Not Available';
    var cleanTitle = title.replace(/"/g, "'");
    f.text.value += "<textarea id=" + qs + schemaId + qs + " style=" + qs + "display:none;visibility:hidden;width:0;height:0;overflow:hidden;opacity:0;position:absolute;" + qs + ">" +
        '{"@context":"https://schema.org","@type":"' + (isSeries ? 'TVSeries' : 'Movie') + '","name":"' + cleanTitle + '","image":"' + poster + '","thumbnailUrl":"' + poster + '","genre":"' + getValue("genre").replace(/"/g, "'") + '","datePublished":"' + getValue("date") + '","inLanguage":"' + getValue("lng") + '","description":"' + cleanDesc + '","duration":"' + getValue("dur") + '"}' +
        "</textarea>";
}

/* ========================= DOM READY ========================= */
document.addEventListener("DOMContentLoaded", function() {
    toggleSeriesAndOttFields();
});