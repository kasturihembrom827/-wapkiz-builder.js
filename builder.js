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
    
    /* PAGE RELOAD */
    setTimeout(function(){
        location.reload();
    }, 1500);
}
