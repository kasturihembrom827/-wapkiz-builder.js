/* =========================TMDB API========================= */
var tmdbKey = "241f3ce228196a68cc8d338aedcdc094";

/* =========================TMDB EXTRA DATA========================= */
var tmdbDirector = "";
var tmdbRating = "";
var tmdbVoteCount = "";
var tmdbProduction = "";
var tmdbCountry = "";

/* =========================DYNAMIC ADD MORE LINK========================= */
function addMoreLinkField(){  
  var container = document.getElementById("extraLinksContainer");  
  var div = document.createElement("div");  
  div.className = "catlist extra-link-row";  
  div.style.marginBottom = "8px";  
  div.innerHTML = '<input type="text" class="extra-name" style="width:70px; margin-right:4px;" placeholder="Ep / Label"/>' +                  
                  '<input type="text" class="extra-url" style="width:140px; margin-right:4px;" placeholder="Download Link"/>' +                  
                  '<input type="text" class="extra-size" style="width:60px; margin-right:4px;" placeholder="Size"/>' +                  
                  '<button type="button" onclick="this.parentElement.remove();" style="background:#ff4d4d; color:#fff; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">✖</button>';  
  container.appendChild(div);
}

/* =========================SHOW/HIDE SERIES & OTT FIELDS========================= */
function toggleSeriesAndOttFields(){    
    var typeEl = document.querySelector('[name="type"]');    
    var sBlock = document.getElementById('seriesBlock');    
    var ottBlock = document.getElementById('ottBlock');        
    if(typeEl){        
        if(typeEl.value === 'series'){            
            if(sBlock) sBlock.style.display = 'block';            
            if(ottBlock) ottBlock.style.display = 'block';        
        } else {            
            if(sBlock) sBlock.style.display = 'none';            
            if(ottBlock) ottBlock.style.display = 'none';        
        }    
    }
}

/* =========================MULTI-QUALITY LINK GENERATOR========================= */
function autoGenerateLinks(){    
    var masterEl = document.getElementById("masterLink");    
    var sizeEl = document.getElementById("masterSize");        
    if(!masterEl || !masterEl.value.trim()){        
        alert("Kripya Master Direct Link dalein!");        
        return;    
    }        
    var master = masterEl.value.trim();    
    var baseSize = sizeEl && sizeEl.value.trim() ? sizeEl.value.trim() : "400MB";        
    var l1 = document.querySelector('[name="link1"]'), s1 = document.querySelector('[name="size1"]');    
    var l2 = document.querySelector('[name="link2"]'), s2 = document.querySelector('[name="size2"]');    
    var l3 = document.querySelector('[name="link3"]'), s3 = document.querySelector('[name="size3"]');    
    var l4 = document.querySelector('[name="link4"]'), s4 = document.querySelector('[name="size4"]');        
    if(l1) l1.value = ""; if(s1) s1.value = "";    
    if(l2) l2.value = ""; if(s2) s2.value = "";    
    if(l3) l3.value = ""; if(s3) s3.value = "";    
    if(l4) l4.value = ""; if(s4) s4.value = "";        
    var g480 = document.getElementById("gen480");    
    var g720 = document.getElementById("gen720");    
    var g1080 = document.getElementById("gen1080");    
    var g4k = document.getElementById("gen4k");        
    if(g480 && g480.checked && l1 && s1){        
        l1.value = master;        
        s1.value = baseSize.toLowerCase().includes("gb") ? "450MB" : baseSize;    
    }    
    if(g720 && g720.checked && l2 && s2){        
        l2.value = master;        
        s2.value = baseSize.toLowerCase().includes("gb") ? baseSize : "950MB";    
    }    
    if(g1080 && g1080.checked && l3 && s3){        
        l3.value = master;        
        s3.value = "2.1GB";    
    }    
    if(g4k && g4k.checked && l4 && s4){        
        l4.value = master;        
        s4.value = "5.5GB";    
    }        
    alert("Multi-Quality Links Auto-Filled!");
}

/* =========================SLUG========================= */
function makeSlug(text){    
    return text ? text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') : '';
}

/* =========================TMDB FETCH========================= */
async function fetchTMDB(){    
    var movieInput = document.getElementById("tmdbMovie");    
    if(!movieInput || movieInput.value.trim() === ""){        
        alert("Enter Movie Name");        
        return;    
    }        
    var movie = movieInput.value.trim();        
    try{        
        var typeEl = document.querySelector('[name="type"]');        
        var isSeries = typeEl ? (typeEl.value == "series") : false;                
        var searchUrl = "https://api.themoviedb.org/3/search/" + (isSeries ? "tv" : "movie") + "?api_key=" + tmdbKey + "&query=" + encodeURIComponent(movie);                
        let response = await fetch(searchUrl);        
        if (!response.ok) throw new Error("TMDB Response Failed: " + response.statusText);
        let data = await response.json();                

        if(!data.results || data.results.length === 0){            
            searchUrl = "https://api.themoviedb.org/3/search/" + (isSeries ? "movie" : "tv") + "?api_key=" + tmdbKey + "&query=" + encodeURIComponent(movie);            
            response = await fetch(searchUrl);            
            data = await response.json();                        
            if(!data.results || data.results.length === 0){                
                alert("Movie / Web Series Not Found");                
                return;            
            }            
            isSeries = !isSeries;        
        }                

        var m = data.results[0];        
        var title = isSeries ? m.name : m.title;        
        var release = isSeries ? m.first_air_date : m.release_date;        
        var year = release ? release.substring(0,4) : "";                
        
        var posterEl = document.querySelector('[name="poster"]');        
        var desEl = document.querySelector('[name="des"]');        
        var dateEl = document.querySelector('[name="date"]');        
        var ottDateEl = document.querySelector('[name="ott_date"]');                

        if(posterEl) posterEl.value = m.poster_path ? "https://image.tmdb.org/t/p/w500" + m.poster_path : "https://dummyimage.com/300x450/cccccc/000000&text=No+Image";        
        if(desEl) desEl.value = m.overview || "";        
        if(dateEl) dateEl.value = release || "";        
        if(ottDateEl) ottDateEl.value = isSeries ? (release || "") : "";                

        var detailUrl = "https://api.themoviedb.org/3/" + (isSeries ? "tv" : "movie") + "/" + m.id + "?api_key=" + tmdbKey;        
        let details = await fetch(detailUrl);        
        let d = await details.json();                

        tmdbCountry = "";        
        if (isSeries) {            
            if (d.origin_country && d.origin_country.length) tmdbCountry = d.origin_country[0];        
        } else {            
            if (d.production_countries && d.production_countries.length) tmdbCountry = d.production_countries[0].iso_3166_1;        
        }                

        tmdbRating = d.vote_average || "";        
        tmdbVoteCount = d.vote_count || "";                

        if(d.production_companies && d.production_companies.length){            
            tmdbProduction = d.production_companies[0].name;        
        }                

        var genreEl = document.querySelector('[name="genre"]');        
        if(d.genres && genreEl){            
            genreEl.value = d.genres.map(function(g){ return g.name; }).join(", ");        
        }                
        
        var durEl = document.querySelector('[name="dur"]');        
        var sNumEl = document.querySelector('[name="season_num"]');        
        var epNumEl = document.querySelector('[name="episode_num"]');        
        var epRunEl = document.querySelector('[name="ep_runtime"]');                

        toggleSeriesAndOttFields();        
        if(isSeries){            
            if(d.number_of_seasons && sNumEl){                
                sNumEl.value = "Season " + (d.number_of_seasons < 10 ? '0' : '') + d.number_of_seasons;            
            }            
            if(d.number_of_episodes && epNumEl){                
                epNumEl.value = "Episodes 01-" + d.number_of_episodes;            
            }            
            var runtimeVal = (d.episode_run_time && d.episode_run_time.length) ? d.episode_run_time[0] + " Min / Episode" : "45 Min / Episode";            
            if(durEl) durEl.value = runtimeVal;            
            if(epRunEl) epRunEl.value = runtimeVal;        
        }else{            
            if(d.runtime && durEl){                
                durEl.value = d.runtime + " Min";            
            }        
        }                
        
        var lang = "Hindi";        
        if(d.original_language){            
            lang = d.original_language;            
            if(lang=="hi") lang="Hindi";            
            else if(lang=="en") lang="English";            
            else if(lang=="ta") lang="Tamil";            
            else if(lang=="te") lang="Telugu";            
            else if(lang=="ml") lang="Malayalam";            
            else if(lang=="kn") lang="Kannada";            
            else if(lang=="bn") lang="Bengali";            
            else if(lang=="ja") lang="Japanese";            
            else if(lang=="ko") lang="Korean";            
            else if(lang=="es") lang="Spanish";                        
            var lngEl = document.querySelector('[name="lng"]');            
            if(lngEl) lngEl.value = lang;        
        }                
        
        /* AUTO FETCH OTT PROVIDERS (FOR SERIES ONLY) */        
        var ottSelect = document.querySelector('[name="ott_platform"]');        
        if (isSeries) {            
            try {                
                var providerUrl = "https://api.themoviedb.org/3/tv/" + m.id + "/watch/providers?api_key=" + tmdbKey;                
                let providerRes = await fetch(providerUrl);                
                let providerData = await providerRes.json();                                
                var providersIN = providerData.results && providerData.results.IN ? providerData.results.IN.flatrate : null;                
                if(!providersIN && providerData.results && providerData.results.US){                    
                    providersIN = providerData.results.US.flatrate;                
                }                                
                if(providersIN && providersIN.length > 0 && ottSelect){                    
                    var pName = providersIN[0].provider_name.toLowerCase();                                        
                    if(pName.includes("netflix")) ottSelect.value = "Netflix";                    
                    else if(pName.includes("amazon") || pName.includes("prime")) ottSelect.value = "Prime Video";                    
                    else if(pName.includes("hotstar") || pName.includes("jio")) ottSelect.value = "JioHotstar";                    
                    else if(pName.includes("zee5") || pName.includes("zee")) ottSelect.value = "ZEE5";                    
                    else if(pName.includes("sony") || pName.includes("liv")) ottSelect.value = "SonyLIV";                    
                    else ottSelect.value = "Other";                
                }            
            } catch(ottErr) {                
                console.log("OTT Fetch Error: ", ottErr);            
            }        
        }        

        /* AUTO TITLE */        
        var qltEl = document.querySelector('[name="qlt"]');        
        var blogTitleEl = document.querySelector('[name="blog_title"]');                
        function updateMovieTitle(){            
            if(!blogTitleEl || !typeEl) return;            
            var qlt = qltEl ? qltEl.value : '720p';            
            if(isSeries){                
                typeEl.value = "series";                
                var sNum = (sNumEl && sNumEl.value) ? sNumEl.value : "Season 1";                
                if(lang == "Hindi"){                    
                    blogTitleEl.value = title + " (" + year + ") " + sNum + " Hindi Web Series " + qlt + " 480p 720p 1080p Download";                
                }else{                    
                    blogTitleEl.value = title + " (" + year + ") " + sNum + " (" + lang + " + Hindi) Dual Audio Web Series " + qlt + " 480p 720p 1080p Download";                
                }            
            }else{                
                typeEl.value = "movie";                
                if(lang == "Hindi"){                    
                    blogTitleEl.value = title + " (" + year + ") Hindi Full Movie " + qlt + " 480p 720p 1080p HD Download";                
                }else{                    
                    blogTitleEl.value = title + " (" + year + ") " + lang + " Hindi Dubbed Full Movie " + qlt + " 480p 720p 1080p HD Download";                
                }            
            }        
        }        
        updateMovieTitle();        
        if(qltEl) qltEl.onchange = updateMovieTitle;                
        
        /* CAST & DIRECTOR */        
        var creditUrl = "https://api.themoviedb.org/3/" + (isSeries ? "tv" : "movie") + "/" + m.id + "/" + (isSeries ? "aggregate_credits" : "credits") + "?api_key=" + tmdbKey;        
        let castApi = await fetch(creditUrl);        
        let castData = await castApi.json();                
        var castEl = document.querySelector('[name="strcast"]');        
        if(castData.cast && castEl){            
            castEl.value = castData.cast.slice(0,10).map(function(c){return c.name;}).join(", ");        
        }                
        tmdbDirector = "";        
        if(castData.crew){            
            var director = castData.crew.find(function(person){return person.job == "Director";});            
            if(director) tmdbDirector = director.name;        
        }                
        
        /* YOUTUBE TRAILER */        
        let videoUrl = "https://api.themoviedb.org/3/" + (isSeries ? "tv" : "movie") + "/" + m.id + "/videos?api_key=" + tmdbKey;        
        let videoApi = await fetch(videoUrl);        
        let videoData = await videoApi.json();        
        var trailerInput = document.getElementById("tmdbTrailer");                
        if(videoData.results && videoData.results.length > 0 && trailerInput){            
            var trailerObj = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube") || videoData.results[0];            
            if(trailerObj && trailerObj.key){                
                trailerInput.value = trailerObj.key;            
            }        
        }                
        
        /* SCREENSHOTS */        
        let ssApi = await fetch("https://api.themoviedb.org/3/" + (isSeries ? "tv" : "movie") + "/" + m.id + "/images?api_key=" + tmdbKey);        
        let ssData = await ssApi.json();        
        if(ssData.backdrops){            
            var shots = ssData.backdrops.slice(0,4);            
            var ss1 = document.querySelector('[name="ss1"]'), ss2 = document.querySelector('[name="ss2"]');            
            var ss3 = document.querySelector('[name="ss3"]'), ss4 = document.querySelector('[name="ss4"]');            
            if(shots[0] && ss1) ss1.value = "https://image.tmdb.org/t/p/w780" + shots[0].file_path;            
            if(shots[1] && ss2) ss2.value = "https://image.tmdb.org/t/p/w780" + shots[1].file_path;            
            if(shots[2] && ss3) ss3.value = "https://image.tmdb.org/t/p/w780" + shots[2].file_path;            
            if(shots[3] && ss4) ss4.value = "https://image.tmdb.org/t/p/w780" + shots[3].file_path;        
        }                
        alert(isSeries ? "Web Series Data Loaded" : "Movie Data Loaded");    
    }catch(e){        
        alert("Fetch Error Details: " + e.message);        
        console.error(e);    
    }
}

/* =========================POST GENERATOR========================= */
function last(f){    
    var qs = decodeURIComponent("%22");    
    f.text.value = "";    
    var autoDate = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});    
    var schemaId = "schema-data-" + makeSlug(f.blog_title.value);    
    var isSeries = f.type.value === 'series';        
    
    /* BREADCRUMB */    
    f.text.value = "<div class="+qs+"breadcrumb"+qs+">"+    
    "<p class="+qs+"home"+qs+">"+    
    "<a href='/'>Home</a> <font color='red'>»</font> "+    
    "<a href='javascript:history.back()'>Back</a> <font color='red'>»</font> "+    
    "<a href="+qs+"/page-movies/"+f.blog_cat.value+"/"+makeSlug(f.blog_cat.options[f.blog_cat.selectedIndex].text)+".html"+qs+">"+f.blog_cat.options[f.blog_cat.selectedIndex].text+"</a> <font color='red'>»</font> "+    
    f.blog_title.value+"</p></div>"+        
    
    /* POSTER */    
    "<p class="+qs+"showimage"+qs+">"+    
    "<img class="+qs+"absmiddle"+qs+" src="+qs+f.poster.value+qs+" onerror="+qs+"this.onerror=null;this.src='https://dummyimage.com/220x260/cccccc/000000&text=No+Image';"+qs+" height="+qs+"260"+qs+" width="+qs+"220"+qs+" alt="+qs+f.blog_title.value+qs+" />"+    
    "</p>"+        
    
    /* DETAILS */    
    "<h2 class="+qs+"header"+qs+">Content Details</h2>"+    
    "<div class="+qs+"description1"+qs+">"+    
    "<div class="+qs+"catlist"+qs+"><b>Title:</b> <font color=#D2691E>"+f.blog_title.value+"</font></div>"+        
    
    /* WEB SERIES DETAILS & OTT ONLY IF WEB SERIES */    
    (isSeries ?         
        (f.season_num.value ? "<div class="+qs+"catlist"+qs+"><b>Season & Episodes:</b> <font color=red>"+f.season_num.value+" ("+(f.episode_num.value||"All Episodes")+")</font></div>" : "") +        
        (f.ep_runtime.value ? "<div class="+qs+"catlist"+qs+"><b>Episode Runtime:</b> <font color=#9400D3>"+f.ep_runtime.value+"</font></div>" : "") +        
        (f.series_status.value ? "<div class="+qs+"catlist"+qs+"><b>Series Status:</b> <font color=#28a745>"+f.series_status.value+"</font></div>" : "") +        
        (f.ott_platform.value ? "<div class="+qs+"catlist"+qs+"><b>OTT Platform:</b> <font color=#007bff>"+f.ott_platform.value+"</font></div>" : "") +        
        (f.ott_date.value ? "<div class="+qs+"catlist"+qs+"><b>OTT Release Date:</b> "+f.ott_date.value+"</div>" : "") +        
        (f.ott_status.value ? "<div class="+qs+"catlist"+qs+"><b>Streaming Status:</b> <font color=#ffc107>"+f.ott_status.value+"</font></div>" : "")    
    : "")+        
    
    /* AUDIO & SUBTITLE */    
    "<div class="+qs+"catlist"+qs+"><b>Audio Format:</b> <font color=#008000>"+(f.audio_format.value || f.lng.value)+"</font></div>"+    
    "<div class="+qs+"catlist"+qs+"><b>Subtitles:</b> <font color=#ff6600>"+f.subtitle_format.value+"</font></div>"+        
    "<div class="+qs+"catlist"+qs+"><b>Genre:</b> <font color=#311DD6>"+f.genre.value+"</font></div>"+    
    "<div class="+qs+"catlist"+qs+"><b>Category:</b> <a href="+qs+"/page-movies/"+f.blog_cat.value+"/"+makeSlug(f.blog_cat.options[f.blog_cat.selectedIndex].text)+".html"+qs+">"+f.blog_cat.options[f.blog_cat.selectedIndex].text+"</a></div>"+    
    "<div class="+qs+"catlist"+qs+"><b>Starcast:</b> <font color=green>"+f.strcast.value.split(',').map(function(name){name=name.trim();var slug=makeSlug(name);return "<a href='/page-starcast/"+slug+".html'>"+name+"</a>";}).join(', ')+"</font></div>"+        
    
    /* SINGLE RELEASE DATE FOR MOVIES */    
    (!isSeries ? "<div class="+qs+"catlist"+qs+"><b>"+(f.date.value.trim()!=='' ? 'Release Date' : 'Post Date')+":</b> "+(f.date.value.trim()!=='' ? f.date.value : autoDate)+"</div>" : "")+        
    "<div class="+qs+"catlist"+qs+"><b>Duration:</b> <font color=#9400D3>"+f.dur.value+"</font></div>"+    
    "<div class="+qs+"catlist"+qs+"><b>Quality:</b> <font color=red>"+f.qlt.value+"</font></div>"+    
    "<div class="+qs+"catlist"+qs+"><b>Language:</b> <font color=green>"+f.lng.value+"</font></div>"+    
    (tmdbRating && tmdbRating!=="0" ?"<div class="+qs+"catlist"+qs+"><b>IMDb Rating:</b> ⭐ "+tmdbRating+"/10 ("+tmdbVoteCount+" Votes)</div>" : "")+    
    (tmdbDirector && tmdbDirector.trim()!==" " ?"<div class="+qs+"catlist"+qs+"><b>Director:</b> <font color=#008B8B>"+tmdbDirector+"</font></div>" : "")+    
    "<div class="+qs+"catlist"+qs+"><b>Description:</b> <font color=#ff0080>"+(f.des.value.trim()? f.des.value : "Description Not Available")+"</font></div>"+    
    "</div>";        
    
    /* TRAILER */    
    var trailerEl = document.getElementById("tmdbTrailer");    
    var trailerKey = trailerEl ? trailerEl.value.trim() : "";    
    if(trailerKey !== ""){        
        f.text.value += "<h2 class="+qs+"header"+qs+">Official Trailer</h2>"+        
        "<div class="+qs+"trailer-box"+qs+" style="+qs+"position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:10px 0;"+qs+">"+        
        "<iframe src="+qs+"https://www.youtube.com/embed/"+trailerKey+qs+" style="+qs+"position:absolute;top:0;left:0;width:100%;height:100%;border:0;"+qs+" allowfullscreen></iframe>"+        
        "</div>";    
    }        
    
    /* DOWNLOAD LINKS */    
    f.text.value += "<h2 class="+qs+"header"+qs+">"+f.blog_title.value+"</h2>"+    
    "<div class="+qs+"download-center"+qs+">";        
    var links=[f.link1,f.link2,f.link3,f.link4,f.link5,f.link6,f.link7,f.link8];    
    var sizes=[f.size1,f.size2,f.size3,f.size4,f.size5,f.size6,f.size7,f.size8];    
    var names=['480p / Ep Zip','720p / Season Zip','1080p','4K / HD','Server 1','Server 2','Server 3','Server 4'];        
    
    for(var i=0; i<links.length; i++){        
        if(!links[i] || links[i].value.trim()=="") continue;        
        var url=links[i].value.trim();        
        if(url.indexOf("http")!==0) continue;                
        var sizeHTML="";        
        if(sizes[i] && sizes[i].value.trim()!=""){            
            sizeHTML="<span class="+qs+"dl-size"+qs+">"+sizes[i].value+"</span>";        
        }                
        f.text.value +=        
        "<div class="+qs+"catRow"+qs+">"+        
        "<a class="+qs+"touch"+qs+        " href="+qs+"javascript:void(0)"+qs+        " onclick="+qs+        "var link='"+url+"';"+        "window.open('https://www.effectivecpmnetwork.com/xy7pmh8hm8?key=e93cdf0b6ef0395ba250bef6adabbbbf','_blank');"+        "setTimeout(function(){window.open(link,'_blank');},1000);"+        "return false;"+        qs+">"+        "⬇️ Download "+f.blog_title.value+" "+names[i]+"<br/>"+        sizeHTML+        "</a>"+        "</div>";    
    }        
    
    /* Extra Dynamic Download Links Processing */    
    var extraRows = document.querySelectorAll(".extra-link-row");    
    extraRows.forEach(function(row){        
        var nameVal = row.querySelector(".extra-name").value.trim() || "Download";        
        var urlVal = row.querySelector(".extra-url").value.trim();        
        var sizeVal = row.querySelector(".extra-size").value.trim();                
        if(urlVal && urlVal.indexOf("http") === 0){            
            var extraSizeHTML = sizeVal ? "<span class="+qs+"dl-size"+qs+">"+sizeVal+"</span>" : "";            
            f.text.value +=            
            "<div class="+qs+"catRow"+qs+">"+            
            "<a class="+qs+"touch"+qs+            " href="+qs+"javascript:void(0)"+qs+            " onclick="+qs+            "var link='"+urlVal+"';"+            "window.open('https://www.effectivecpmnetwork.com/xy7pmh8hm8?key=e93cdf0b6ef0395ba250bef6adabbbbf','_blank');"+            "setTimeout(function(){window.open(link,'_blank');},1000);"+            "return false;"+            qs+">"+            "⬇️ Download "+f.blog_title.value+" "+nameVal+"<br/>"+            extraSizeHTML+            "</a>"+            "</div>";        
        }    
    });        
    f.text.value += "</div>";        
    
    /* SCREENSHOTS */    
    var screenshotHTML = "";    
    if(f.ss1.value.trim()!==""){screenshotHTML += "<img class="+qs+"screen-img"+qs+" src="+qs+f.ss1.value+qs+" loading="+qs+"lazy"+qs+" />";}    
    if(f.ss2.value.trim()!==""){screenshotHTML += "<img class="+qs+"screen-img"+qs+" src="+qs+f.ss2.value+qs+" loading="+qs+"lazy"+qs+" />";}    
    if(f.ss3.value.trim()!==""){screenshotHTML += "<img class="+qs+"screen-img"+qs+" src="+qs+f.ss3.value+qs+" loading="+qs+"lazy"+qs+" />";}    
    if(f.ss4.value.trim()!==""){screenshotHTML += "<img class="+qs+"screen-img"+qs+" src="+qs+f.ss4.value+qs+" loading="+qs+"lazy"+qs+" />";}        
    
    if(screenshotHTML!==""){        
        f.text.value += "<h2 class="+qs+"header"+qs+">Screenshots</h2>"+"<div class="+qs+"screens-wrapper"+qs+">"+screenshotHTML+"</div>";    
    }        
    
    /* TRENDING TAGS */    
    var movieTitle=(f.blog_title.value||"").trim();    
    var lang=(f.lng.value||"").trim();    
    var quality=(f.qlt.value||"").trim();    
    var genre=f.genre.value?f.genre.value.split(",")[0].trim():"";    
    var year="";    
    if(f.date&&f.date.value){        
        var y=f.date.value.match(/\d{4}/);    
        if(y) year=y[0];    
    }    
    var actor="";    
    if(f.strcast&&f.strcast.value){        
        actor=f.strcast.value.split(",")[0].trim();    
    }    
    var trendTitle=movieTitle;    
    var searchTags=[trendTitle+" Movie Download",trendTitle+" Full Movie",trendTitle+" Watch Online",trendTitle+" Trailer",trendTitle+" Teaser",trendTitle+" HD Movie",trendTitle+" 480p Download",trendTitle+" 720p Download",trendTitle+" 1080p Download",trendTitle+" "+lang,trendTitle+" "+quality,trendTitle+" "+year,trendTitle+" "+genre+" Movie",trendTitle+" Direct Download"];        
    
    if(actor){        
        searchTags.push(actor+" Movies");        
        searchTags.push(trendTitle+" "+actor);    
    }        
    
    var added={};    
    var trendingHTML="<h2 class="+qs+"header"+qs+">Trending Searches</h2><div class="+qs+"trendingBox"+qs+">";    
    for(var i=0;i<searchTags.length;i++){        
        var tag = (searchTags[i] || "").trim();        
        if(tag.length<2) continue;        
        var key=tag.toLowerCase();        
        if(added[key]) continue;        
        added[key]=true;        
        trendingHTML+="<a class="+qs+"tagbtn"+qs+" href='/page-search/"+encodeURIComponent(tag)+".html'>"+tag+"</a>";    
    }    
    trendingHTML+="</div>";    
    f.text.value+=trendingHTML;        
    
    /* JSON LD SCHEMA */    
    var cleanDesc = f.des.value.trim() ? f.des.value.replace(/"/g, '"').replace(/\n/g, ' ') : 'Description Not Available';    
    var cleanTitle = f.blog_title.value.replace(/"/g, '"');        
    
    f.text.value += "<textarea id="+qs+schemaId+qs+" style="+qs+"display:none;visibility:hidden;width:0;height:0;overflow:hidden;opacity:0;position:absolute;"+qs+">"+    
    '{' +    '"@context":"https://schema.org",' +    '"@type":"'+(isSeries?'TVSeries':'Movie')+'",' +    '"name":"'+cleanTitle+'",' +    '"image":"'+f.poster.value+'",' +    '"thumbnailUrl":"'+f.poster.value+'",' +    '"genre":"'+f.genre.value.replace(/"/g,'"')+'",' +    '"datePublished":"'+f.date.value+'",' +    '"inLanguage":"'+f.lng.value+'",' +    '"description":"'+cleanDesc+'",' +    '"duration":"'+f.dur.value+'",' +    '"actor":['+f.strcast.value.split(',').filter(Boolean).map(function(name){return '{"@type":"Person","name":"'+name.trim().replace(/"/g,'"')+'"}';}).join(',')+'],' +    '"director":{"@type":"Person","name":"'+(tmdbDirector || "Unknown")+'"},' +    '"aggregateRating":{' +    '"@type":"AggregateRating",' +    '"ratingValue":'+(parseFloat(tmdbRating) || 7.0)+',' +    '"bestRating":10,' +    '"worstRating":1,' +    '"ratingCount":'+((tmdbVoteCount && parseInt(tmdbVoteCount) > 0) ? parseInt(tmdbVoteCount) : 1000) +    '}' +    '}'+"</textarea>";        
    
    /* REFRESH PAGE */
    setTimeout(function(){
        location.reload();
    }, 1500);
}
