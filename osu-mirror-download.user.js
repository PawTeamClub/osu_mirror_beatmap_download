// ==UserScript==
// @name         osu! Mirror Download
// @namespace    https://pawteam.club
// @version      1.0.0
// @description  osu! 快捷镜像下载
// @author       Bottame | Azure99 -> original author
// @run-at       document-idle
// @license      MIT License
// @match        http*://osu.ppy.sh/beatmapsets/*
// ==/UserScript==

(function() {
    'use strict';

    // Google Function :/
    String.prototype.format = function() { var formatted = this; for( var arg in arguments ) { formatted = formatted.replace("{" + arg + "}", arguments[arg]); } return formatted; };

    let formatString = {
        // Sayobot API
        sayobot_full: "https://txy1.sayobot.cn/beatmaps/download/full/{0}?server=auto",
        sayobot_novideo: "https://txy1.sayobot.cn/beatmaps/download/novideo/{0}?server=auto",
        sayobot_mini: "https://txy1.sayobot.cn/beatmaps/download/mini/{0}?server=auto",
        // Chimu API
        chimu_full: "https://api.chimu.moe/v1/download/{0}",
        // Copy: https://github.com/Azure99/osu-download-booster
        downloadButtomHTML: '<a class="btn-osu-mirror btn-osu-big btn-osu-big--beatmapset-header " href={0} data-turbolinks="false"><span class="btn-osu-big__content"><span class="btn-osu-big__left"><span class="btn-osu-big__text-top">{1}</span><span class="btn-osu-big__text-bottom">{2}</span></span><span class="btn-osu-big__icon"><span class="fa fa-fw"><span class="fas fa-download"></span></span></span></span></a>',
    }

    function createButtom(downloadURL, titleTop, titleButtom)
    {
        $('.beatmapset-header__buttons').append(formatString.downloadButtomHTML.format(downloadURL, titleTop || "镜像下载", titleButtom || "由SayoBot"))
    }

    function initButtom(jsonScript)
    {
        // Copy: https://github.com/Azure99/osu-download-booster
        let needInsert = $('.beatmapset-header__buttons').length == 1 && $('.beatmapset-header__buttons')[0].innerHTML.indexOf('/download"') && $('.btn-osu-mirror').length === 0;
        if (!needInsert) return false;

        // Get osu! Web JSON (?)
        const jsonData = JSON.parse(jsonScript.textContent);

        // Mirror URL Format
        const fullURL = formatString.sayobot_full.format(jsonData.id);
        const noVideoURL = formatString.sayobot_novideo.format(jsonData.id);
        const miniURL = formatString.sayobot_mini.format(jsonData.id);
        const chimufullURL = formatString.chimu_full.format(jsonData.id);

        // Create Download Buttom
        createButtom(fullURL, "镜像下载", "由Sayobot提供")
        if (jsonData.video) { createButtom(noVideoURL, "镜像下载 (无视频)", "由Sayobot提供") }
        if (jsonData.storyboard) { createButtom(miniURL, "镜像下载 (迷你)", "由Sayobot提供") }
        createButtom(chimufullURL, "镜像下载", "由Chimu提供")
    }

    const init = function ()
    {
        const curjsonScript = document.getElementById("json-beatmapset");
        if (curjsonScript) { initButtom(curjsonScript); }
    }

    setInterval(init, 100);

})();
