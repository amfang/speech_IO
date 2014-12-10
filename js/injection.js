if(!window.speechRecognitionInjection){
    //console.log(document.location.href);
    //var speech_IO_href = document.location.href;
    // show control bar
    
    if(!window.speech_IO){
        window.speech_IO = {};
        speech_IO.audio = {};
        speech_IO.audio.contents = [];
    }

    speech_IO.supportSites = {
        'read.qidian.com':'getQidianContents',
        'book.zongheng.com':'getZonghengContents',
        'chuangshi.qq.com':'getChuangshiContents',
        'tieba.baidu.com':'getTiebaContents',
    };

    speech_IO.audio.prepareContents = function(content){

        var strArr = content.split(/[,.!?;，。！？；]/);
        var res = [];
        for(i in strArr){
            if(strArr[i].trim() != ''){
                res.push(strArr[i]);
            }
        }
        return res;
    }


    speech_IO.audio.getQidianContents = function(){
        if(document.location.pathname.indexOf('/BookReader/') < 0){
            return false;
        }
        var content = document.getElementById('content');
        if(!content){
            return false;
        }
        return speech_IO.audio.prepareContents(content.innerText);
    }
    speech_IO.audio.getZonghengContents = function(){
        if(document.location.pathname.indexOf('/chapter/') < 0){
            return false;
        }
        var content = document.getElementById('chapterContent');
        if(!content){
            return false;
        }
        return speech_IO.audio.prepareContents(content.innerText);
    }
    speech_IO.audio.getChuangshiContents = function(){
        if(document.location.pathname.indexOf('/bk/') < 0){
            return false;
        }
        var content = $('.bookreadercontent');
        if(!content){
            return false;
        }
        return speech_IO.audio.prepareContents(content.text());
    }
    speech_IO.audio.getTiebaContents = function(){
        if(document.location.pathname.indexOf('/p/') < 0){
            return false;
        }
        var content = $('.d_post_content');
        if(!content || content.length == 0){
            return false;
        }

        var _content = '';
        content.each(function(ind, item){
            _content += $(item).text();
        });
        return speech_IO.audio.prepareContents(_content);
    }


    if(speech_IO.audio.contents = speech_IO.audio[speech_IO.supportSites[document.location.hostname]]()){

    speech_IO.showControlBar = function(){
    
        var pControl;
        if(pControl = document.getElementById('speech_IO_control')){
            //pControl.innerText = tip;
            pControl.style.display = 'block';
        }
        else{
            // init control pannel
            pControl = document.createElement('div');
            pControl.id = 'speech_IO_control';
            //pControl.innerText = tip;
            pControl.style.display = 'block';
            pControl.style.border = '1px solid white';
            pControl.style.borderRadius = '5px';
            pControl.style.backgroundColor = 'black';
            pControl.style.width = '150px';
            pControl.style.height = '30px';
            pControl.style.color = 'grey';
            pControl.style.textAlign = 'center';
            pControl.style.position = 'fixed';
            pControl.style.top = '200px';
            pControl.style.right = '20px';
            pControl.style.opacity = '0.8';
            pControl.style.zIndex = '9999';
            //pControl.style.lineHeight = '50px';
            pControl.draggable = 'true';
            pControl.style.cursor = 'move';
            // init audio element
            var tts_audio = document.createElement('audio');
            tts_audio.id = 'tts_audio';
            tts_audio.style.display = 'none';
            
            // init play btn
            var playBtn = document.createElement('button');
            playBtn.id = 'speech_IO_play_btn';
            playBtn.innerText = '>';
            playBtn.style.display = 'inline-block';
            playBtn.style.borderTopLeftRadius = '5px';
            playBtn.style.borderBottomLeftRadius = '5px';
            playBtn.style.borderStyle = 'none';
            playBtn.style.borderRightWidth = '1px';
            playBtn.style.borderRightColor = '#999';
            playBtn.style.borderRightStyle = 'solid';
            playBtn.style.backgroundColor = 'black';
            playBtn.style.width = '50px';
            playBtn.style.height = '30px';
            playBtn.style.color = 'grey';
            playBtn.style.textAlign = 'center';
            playBtn.style.lineHeight = '30px';
            playBtn.style.float = 'left';
            // init next btn
            var nextBtn = document.createElement('button');
            nextBtn.id = 'speech_IO_next_btn';
            nextBtn.innerText = '>>';
            nextBtn.style.display = 'inline-block';
            //nextBtn.style.borderTopLeftRadius = '5px';
            //nextBtn.style.borderBottomLeftRadius = '5px';
            nextBtn.style.borderStyle = 'none';
            nextBtn.style.borderRightWidth = '1px';
            nextBtn.style.borderRightColor = '#999';
            nextBtn.style.borderRightStyle = 'solid';
            nextBtn.style.backgroundColor = 'black';
            nextBtn.style.width = '50px';
            nextBtn.style.height = '30px';
            nextBtn.style.color = 'grey';
            nextBtn.style.textAlign = 'center';
            nextBtn.style.lineHeight = '30px';
            nextBtn.style.float = 'left';

            tts_audio.addEventListener('ended', function(){
                speech_IO.audio.next();
            });

            playBtn.addEventListener('click', function(){
                if(playBtn.innerText == '>'){
                    // play
                    speech_IO.audio.play();
                    playBtn.innerText = '||';
                }
                else{
                    // pause
                    speech_IO.audio.pause();
                    playBtn.innerText = '>';
                }
            });
            nextBtn.addEventListener('click', function(){
                // next
                speech_IO.audio.next();
                playBtn.innerText = '||';
            });

            pControl.appendChild(tts_audio);
            pControl.appendChild(playBtn);
            pControl.appendChild(nextBtn);
            document.body.insertBefore(pControl, document.body.firstChild);

            speech_IO.tts_audio = tts_audio;

            $(pControl).drags();
        }
    }

    speech_IO.initDragSupport = function(){
        // drag support for jquery, without jqueryui
        (function($) {
            $.fn.drags = function(opt) {

                opt = $.extend({handle:"",cursor:"move"}, opt);

                if(opt.handle === "") {
                    var $el = this;
                } else {
                    var $el = this.find(opt.handle);
                }

                return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
                    if(opt.handle === "") {
                        var $drag = $(this).addClass('draggable');
                    } else {
                        var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                    }
                    var z_idx = $drag.css('z-index'),
                       drg_h = $drag.outerHeight(),
                       drg_w = $drag.outerWidth(),
                       pos_y = $drag.offset().top + drg_h - e.pageY,
                       pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                    $('.draggable').offset({
                        top:e.pageY + pos_y - drg_h,
                        left:e.pageX + pos_x - drg_w
                    }).on("mouseup", function() {
                        $(this).removeClass('draggable').css('z-index', z_idx);
                    });
                });
                e.preventDefault(); // disable selection
                }).on("mouseup", function() {
                    if(opt.handle === "") {
                        $(this).removeClass('draggable');
                    } else {
                        $(this).removeClass('active-handle').parent().removeClass('draggable');
                    }
                });

            }
        })(jQuery);
    }

    //speech_IO.audio = {};

    //speech_IO.audio.contents = [];
    speech_IO.audio.currentIndex = 0;
    //speech_IO.audio.urlPrefix = "http://tts.baidu.com/text2audio?cuid=baidutest&lan=zh&ctp=1&pdt=1&tex=";
    //speech_IO.audio.urlPrefix = "http://tts.baidu.com/text2audio?cuid="
    //    + speech_IO.backgroundWindow.getCuid()
    //    + "&lan=zh&ctp=1&pdt=1&tex=";
    //speech_IO.audio.getContents = function(){
    //    // TODO
    //    //speech_IO.audio.contents = ['这是一个很寂寞的天','下着有些伤心的雨'];
    //    //speech_IO.audio.contents = speech_IO.audio.getQidianContents();
    //    speech_IO.audio.contents = speech_IO.audio[speech_IO.supportSites[document.location.hostname]]();
    //    return speech_IO.audio.contents;
    //}

    speech_IO.audio.setContents = function(){
        // get contents
    }

    speech_IO.audio.play = function(){
        if(speech_IO.audio.contents.length == 0){
            return false;
            //speech_IO.audio.getContents();
        }

        if(speech_IO.tts_audio.src == ''){
            var str = speech_IO.audio.contents[speech_IO.audio.currentIndex];

            speech_IO.tts_audio.src = speech_IO.audio.urlPrefix + encodeURIComponent(str);
            speech_IO.tts_audio.play();
        }
        else{
            speech_IO.tts_audio.play();
        }
        return true;
    }

    speech_IO.audio.pause = function(){
        speech_IO.tts_audio.pause();
    }

    speech_IO.audio.prev = function(){
        if(speech_IO.audio.currentIndex <= 0){
            return false;
        }
        speech_IO.audio.currentIndex --;
        if(speech_IO.audio.currentIndex < speech_IO.audio.contents.length){
            var str = speech_IO.audio.contents[speech_IO.audio.currentIndex];
            speech_IO.tts_audio.src = speech_IO.audio.urlPrefix + encodeURIComponent(str);
            speech_IO.tts_audio.play();
        }
    }

    speech_IO.audio.next = function(){
        speech_IO.audio.currentIndex ++;
        if(speech_IO.audio.currentIndex < speech_IO.audio.contents.length){
            var str = speech_IO.audio.contents[speech_IO.audio.currentIndex];
            speech_IO.tts_audio.src = speech_IO.audio.urlPrefix + encodeURIComponent(str);
            speech_IO.tts_audio.play();
        }
    }



    speech_IO.init = function(callback){
        // init cuid
        chrome.extension.sendMessage(null, {method:'getCuid'}, function(res){
            // init audio url prefix
            speech_IO.audio.urlPrefix = "http://tts.baidu.com/text2audio?cuid=" + res.cuid + "&lan=zh&ctp=1&pdt=1&tex=";
            return callback();
        });
    }


    speech_IO.init(function(){
        speech_IO.initDragSupport();
        speech_IO.showControlBar();
    });
    }

    // if qidian, zongheng, tieba , add read button
}
window.speechRecognitionInjection = true;
