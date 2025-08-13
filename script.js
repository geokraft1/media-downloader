document.addEventListener("DOMContentLoaded",()=>{
    const videoURL=document.getElementById("videoURL");
    const previewBtn=document.getElementById("previewBtn");
    const downloadBtn=document.getElementById("downloadBtn");
    const previewContainer=document.getElementById("previewContainer");
    const progress=document.getElementById("progress");
    const status=document.getElementById("status");
    const historyList=document.getElementById("historyList");
    const themeToggle=document.getElementById("themeToggle");
    const languageSelect=document.getElementById("languageSelect");
    const format=document.getElementById("format");
    const quality=document.getElementById("quality");

    const texts={
        ka:{
            title:"🎵 Media Downloader 🎬",
            placeholder:"ჩაწერე ბმული...",
            previewBtn:"👁️ გადახედე",
            downloadBtn:"⬇️ ჩამოტვირთე",
            noUrl:"❌ გთხოვ ჩაწერო ბმული!",
            unsupported:"❌ მხარდაჭერილი ბმულები: YouTube, TikTok",
            downloadComplete:"✅ ჩამოტვირთვა დასრულებულია!",
            highest:"ყველაზე მაღალი ხარისხი",
            lowest:"დაბალი ხარისხი",
            mp4:"MP4 (ვიდეო)",
            mp3:"MP3 (აუდიო)"
        },
        en:{
            title:"🎵 Media Downloader 🎬",
            placeholder:"Enter YouTube or TikTok link...",
            previewBtn:"👁️ Preview",
            downloadBtn:"⬇️ Download",
            noUrl:"❌ Please enter a link!",
            unsupported:"❌ Supported links: YouTube, TikTok",
            downloadComplete:"✅ Download completed!",
            highest:"Highest quality",
            lowest:"Lowest quality",
            mp4:"MP4 (Video)",
            mp3:"MP3 (Audio)"
        },
        ru:{
            title:"🎵 Медиа Загрузчик 🎬",
            placeholder:"Введите ссылку на YouTube или TikTok...",
            previewBtn:"👁️ Просмотр",
            downloadBtn:"⬇️ Скачать",
            noUrl:"❌ Пожалуйста, введите ссылку!",
            unsupported:"❌ Поддерживаемые ссылки: YouTube, TikTok",
            downloadComplete:"✅ Загрузка завершена!",
            highest:"Высшее качество",
            lowest:"Низкое качество",
            mp4:"MP4 (Видео)",
            mp3:"MP3 (Аудио)"
        }
    };

    function updateLanguage(lang){
        const t=texts[lang];
        document.querySelector("h1").innerText=t.title;
        videoURL.placeholder=t.placeholder;
        previewBtn.innerText=t.previewBtn;
        downloadBtn.innerText=t.downloadBtn;
        format.options[0].text=t.mp4;
        format.options[1].text=t.mp3;
        quality.options[0].text=t.highest;
        quality.options[1].text=t.lowest;
    }

    languageSelect.addEventListener("change",()=>updateLanguage(languageSelect.value));

    themeToggle.addEventListener("click",()=>{ document.body.classList.toggle("dark-theme"); });

    previewBtn.addEventListener("click",()=>{
        const url=videoURL.value.trim();
        const lang=languageSelect.value;
        const t=texts[lang];
        if(!url){ status.innerText=t.noUrl; return; }
        status.innerText="";
        previewContainer.innerHTML="";
        if(url.includes("youtube.com") || url.includes("youtu.be")){
            const videoId=url.includes("youtu.be")?url.split("/").pop():new URL(url).searchParams.get("v");
            const iframe=document.createElement("iframe");
            iframe.src=`https://www.youtube.com/embed/${videoId}`;
            iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            previewContainer.appendChild(iframe);
        }else if(url.includes("tiktok.com")){
            const video=document.createElement("video");
            video.src=url; video.controls=true; video.autoplay=false;
            previewContainer.appendChild(video);
        }else{
            status.innerText=t.unsupported;
        }
    });

    downloadBtn.addEventListener("click",()=>{
        const url=videoURL.value.trim();
        const lang=languageSelect.value;
        const t=texts[lang];
        if(!url){ status.innerText=t.noUrl; return; }
        status.innerText="⏳ "+t.downloadBtn+"...";
        progress.style.width="0%";
        let loaded=0;
        const interval=setInterval(()=>{
            loaded+=Math.random()*15;
            if(loaded>=100){ loaded=100; clearInterval(interval); status.innerText=t.downloadComplete;
                const li=document.createElement("li"); li.innerText=`${url} (${format.value.toUpperCase()})`; historyList.prepend(li);
            }
            progress.style.width=loaded+"%";
        },400);
    });

    // Default language
    updateLanguage(languageSelect.value);
});
