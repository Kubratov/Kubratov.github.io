jQuery(document).ready(function($){
    let status;
    let github;
    let jlpt = null;
    let speed;
    let kanji_list;
    let kana_visibility;
    let button_visibility;
    let vid;
    let pid = 0;
    let down;

    if (typeof json !== 'undefined') github = true;
    kana_visibility = true;
    button_visibility = true;

    if (!button_visibility) {
        button_visibility = true;
        ctrl();
    }

    $('#welcome').html('はじめましょ');

    $('html').keydown(function(e){
        console.log(status);
        if (!status) {
            if (e.keyCode == 13) getData();
            if (e.keyCode == 17) ctrl();
        }
        else if (status == 'run'){
            if (e.keyCode == 32) {
                status = 'stop';
                pid++;
            }
            if (e.keyCode == 17) ctrl();
            if (e.keyCode == 16) shift();
        }
        else {
            if (e.keyCode == 13) {
                console.log(pid);
                run(0, pid);
            }
            if (e.keyCode == 16) shift();
            if (e.keyCode == 17) ctrl();
            if (e.keyCode == 32) if (kanji_list[vid+1]) run(vid, pid);
            if (e.keyCode == 37) if (kanji_list[vid-1]) change(vid-1);
            if (e.keyCode == 39) if (kanji_list[vid+1]) change(vid+1);
        }
    });
    $('#enter').on('click', function(){
        if (!status) getData();
        else if (status == 'stop') run(0, pid);
    })
    $('#space').on('click', function(){
        if (status == 'stop') {
            if (kanji_list[vid+1]) run(vid, pid);
        }
        else if (status == 'run'){
            status = 'stop';
            pid++;
        }
    })
    $('#shift').on('click', function(){
        shift();
    })
    $('#ctrl').on('click', function(){
        ctrl();
    })
    $('#left').on('mousedown', async function(){
        if (status == 'stop'){
            down = true;

            while (down == true) {
                if (kanji_list[vid-1]) change(vid-1);
                await sleep(100);
            }
        }
    })
    $('#left').on('mouseup', function(){
        if (status == 'stop') down = false;
    })
    $('#right').on('mousedown', async function(){
        if (status == 'stop'){
            down = true;
        
            while (down == true) {
                if (kanji_list[vid+1]) change(vid+1);
                await sleep(50);
            }
        }
    })
    $('#right').on('mouseup', function(){
        if (status == 'stop') down = false;
    })
    function getData() {
        jlpt = $('#jlpt').val();
        if ($('#speed').val()) speed = $('#speed').val(); else speed = 100;
        if (github) {
            let decode_json = JSON.parse(json);
            let data = [];

            if (jlpt) {
                decode_json.forEach(kanji => {
                    if (kanji['JLPT'] == jlpt) data.push(kanji);
                });
            }
            else data = decode_json;
            data = shuffle(data);
        
            build(data);
        }
        else {
            let form_data = new FormData();
            form_data.append('jlpt', jlpt);

            $.ajax({
                url: 'getData.php',
                dataType: 'text',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                success: async function(php_script_response){
                    let data = JSON.parse(php_script_response);
                    build(data);
                }
            });
        }
    }
    function shift() {
        if (kana_visibility) {
            kanji_list.forEach(kanji => {
                kanji.children('.name').css('visibility', 'hidden');
                kanji.children('.on').css('visibility', 'hidden');
                kanji.children('.kun').css('visibility', 'hidden');
            })
            kana_visibility = false;
        }
        else {
            kanji_list.forEach(kanji => {
                kanji.children('.name').css('visibility', 'visible');
                kanji.children('.on').css('visibility', 'visible');
                kanji.children('.kun').css('visibility', 'visible');
            })
            kana_visibility = true;
        }
    }
    function ctrl() {
        if (button_visibility) {
            $('button').each(function() {
                $(this).css('display', 'none');
            })
            $('#ctrl').css('display', 'block');
            $('#ctrl').css('right', '0');
            $('#ctrl').css('width', '100vw');
            $('#ctrl').css('height', '30px');
            button_visibility = false;
        }
        else {
            $('button').each(function() {
                $(this).css('display', 'block');
            })
            $('#ctrl').css('display', 'block');
            $('#ctrl').css('right', '80px');
            $('#ctrl').css('width', '80px');
            $('#ctrl').css('height', '80px');
            button_visibility = true;
        }
    }
    async function run(id, pid_temp) {
        status = 'run';

        if (vid) kanji_list[vid].css('display', 'none');
        for (let i = id; i < kanji_list.length; i++) {
            if (status == 'run' && pid == pid_temp) {
                if (kanji_list[i-1]) kanji_list[i-1].css('display', 'none');
                kanji_list[i].css('display', 'flex');
                if (i == kanji_list.length - 1) status = 'stop';
                vid = i;
                await sleep(speed);
            }
            else break;
        }
    }
    function change(id) {
        kanji_list[vid].css('display', 'none');
        kanji_list[id].css('display', 'flex');
        vid = id;
    }

    function build(data) {
        $('#start').css('display', 'none');
        i=1;
        data.forEach(kanji => {
            if (!kanji['on_reading']) kanji['on_reading'] = '-';
            if (!kanji['kun_reading']) kanji['kun_reading'] = '-';
            $('body').append("<div id=" + i + " class='block kanji-block' style='display:none'><div class='id'>" + i + "</div><div class='kanji'>" + kanji['name'] + "</div><div class='name'>" + kanji['meaning'] + "</div><div class='on'>" + kanji['on_reading'] + "</div><div class='kun'>" + kanji['kun_reading'] + "</div></div>");
            i++;
        });

        kanji_list = [];
        $('.kanji-block').each(function() {
            kanji_list.push($(this));
        })
        run(0, pid);
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }      
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
