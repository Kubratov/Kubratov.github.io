jQuery(document).ready(function($){
    let status;
    let github;
    let jlpt = null;
    let speed;
    let kanji_list;
    let kana_visibility;
    let vid;

    if (typeof json !== 'undefined') {
        github = true;
    }
    kana_visibility = true;

    $('#welcome').html('はじめましょ');
    // $('#welcome').css('visibility', 'visible');

    $('html').keydown(function(e){
        if (!status) {
            if (e.keyCode == 13) {
                jlpt = $('#jlpt').val();
                speed = $('#speed').val();

                if (github) {
                    let decode_json = JSON.parse(json);
                    let data = [];

                    if (jlpt) {
                        decode_json.forEach(kanji => {
                            if (kanji['JLPT'] == jlpt) data.push(kanji);
                        });
                    }
                    else {
                        data = decode_json;
                    }
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
            // if (e.keyCode <= 58 && e.keyCode >= 48) {
            //     if ($('#jlpt').html() == 'Укажите скорость в мс' && $('#jlpt').css('visibility') == 'visible')
            //     {
            //         $('#speed').html($('#speed').html() + (e.keyCode - 48));
            //         speed = $('#speed').html();
            //     }
            //     else if (e.keyCode <= 53 && e.keyCode >= 49) {
            //         if (!jlpt) {
            //             $('#jlpt').css('visibility', 'visible');
            //             $('#welcome').css('visibility', 'hidden');
            //         }
            //         jlpt = e.keyCode - 48;
            //         $('#jlpt').html('JLPT №' + jlpt);
            //     }
            // }
            // if (e.keyCode == 16) {
            //     if ($('#jlpt').css('visibility') == 'hidden') {
            //         if (!jlpt) {
            //             $('#jlpt').css('visibility', 'visible');
            //             $('#speed').css('visibility', 'visible');
            //             $('#welcome').css('visibility', 'hidden');
            //         }
            //         $('#jlpt').html('Укажите скорость в мс');
            //     }
            //     else if ($('#jlpt').html() == 'Укажите скорость в мс') {
            //         if (!jlpt) {
            //             $('#jlpt').css('visibility', 'hidden');
            //             $('#welcome').css('visibility', 'visible');
            //         }
            //         else {
            //             $('#jlpt').html('JLPT №' + jlpt);
            //         }
            //         $('#speed').css('visibility', 'hidden');
            //     }
            //     else {
            //         $('#jlpt').html('Укажите скорость в мс');
            //         $('#speed').css('visibility', 'visible');
            //     }
            // }
        }
        else if (status == 'run'){
            if (e.keyCode == 32) {
                status = 'stop';
            }
        }
        else {
            if (e.keyCode == 13) {
                run(0);
            }
            if (e.keyCode == 16) {
                kanji_list.forEach(kanji => {
                    if (kana_visibility) {
                        $('.on').css('visibility', 'hidden');
                        $('.kun').css('visibility', 'hidden');
                        kana_visibility = false;
                    }
                    else {
                        $('.on').css('visibility', 'visible');
                        $('.kun').css('visibility', 'visible');
                        kana_visibility = true;
                    }
                })
            }
            if (e.keyCode == 32) {
                if (kanji_list[vid+1]) run(vid+1);
            }
            if (e.keyCode == 37) {
                if (kanji_list[vid-1]) change(vid-1);
            }
            if (e.keyCode == 39) {
                if (kanji_list[vid+1]) change(vid+1);
            }
        }
    });
    async function run(id) {
        status = 'run';

        if (vid) kanji_list[vid].css('display', 'none');
        for (let i = id; i < kanji_list.length; i++) {
            if (status == 'run') {
                if (kanji_list[i-1]) kanji_list[i-1].css('display', 'none');
                kanji_list[i].css('display', 'flex');
                vid = i;
                await sleep(speed);
            }
            else {
                break;
            }
        }
        status = 'stop';
    }
    function change(id) {
        kanji_list[vid].css('display', 'none');
        kanji_list[id].css('display', 'flex');
        vid = id;
    }

    function build(data) {
        $('body').html('')

        i=1;
        data.forEach(kanji => {
            $('body').append("<div id=" + i + " class='block' style='display:none'><div class='id'>" + i + "</div><div class='kanji'>" + kanji['name'] + "</div><div class='name'>" + kanji['meaning'] + "</div><div class='on'>" + kanji['on_reading'] + "</div><div class='kun'>" + kanji['kun_reading'] + "</div></div>");
            i++;
        });

        kanji_list = [];
        $('.block').each(function() {
            kanji_list.push($(this));
        })
        run(0);
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
