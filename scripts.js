jQuery(document).ready(function($){
    let status;
    let load_status;
    let saved_mode;
    let baned_mode;
    let banedViewMode;
    let github;
    let jlpt = null;
    let speed;
    let kanji_list;
    let all_kanji_list = [];
    let saved_kanji_list = [];
    let baned_kanji_list = [];
    let saved_status_list = [];
    let baned_status_list = [];
    let colors = [];
    let activeColor = 0;
    let find_status = 0;
    let banedViewStatus;
    let banedUnviewStatus;
    let kana_visibility;
    let button_visibility;
    let vid;
    let pid = 0;
    let down;
    let stopped;
    let dark_mode;
    let timer;

    if (typeof json !== 'undefined') github = true;
    if (dark_mode) changeBackColorMode;

    colors.push('brown');
    colors.push('yellow');
    colors.push('red');
    colors.push('white');

    if (!button_visibility) {
        button_visibility = true;
        // ctrl();
    }

    $('#welcome').html('はじめましょ');

    $('html').keydown(function(e){
        console.log(e.keyCode);
        if (e.keyCode == 38) changeBackColorMode(1);
        if (e.keyCode == 40) changeBackColorMode(-1);
        if (e.keyCode == 192) changeBackColorMode();
        if (e.keyCode == 45) {
            // block = $('#test');
            // // a = 'dfsfsdsdf';
            // let text = block.html().replace(/(\<(\/?[^>]+)>)/g, '');
            // text = text.replace(/\s+/g, ' ').trim();
            // // alert(Text);
            // console.log(block.html());

            let a = true;
            let b = false;
            let c = false;

            if (a || b && c) alert(5);
        }
        if (!status) {
            if (e.keyCode == 13) getData();
            // if (e.keyCode == 17) ctrl();
        }
        else if (status == 'run'){
            if (e.keyCode == 8) basckspace();
            if (e.keyCode == 32) {
                status = 'stop';
                pid++;
            }
            // if (e.keyCode == 17) ctrl();
            if (e.keyCode == 16) shift();
        }
        else {
            if (e.keyCode == 8) basckspace();
            if (e.keyCode == 13) {
                console.log(pid);
                run(0, pid);
            }
            if (e.keyCode == 16) shift();
            if (e.keyCode == 17) ctrl();
            if (e.keyCode == 32) if (kanji_list[vid+1]) run(vid, pid);
            if (e.keyCode == 37) if (kanji_list[vid-1]) change(vid-1);
            if (e.keyCode == 39) if (kanji_list[vid+1]) change(vid+1);
            if (e.keyCode == 46) if (baned_mode || banedViewMode) banKanji();
            // if (e.keyCode == 106) find(vid);
            // if (e.keyCode == 107) !find_status ? find(vid) : find_status++;
            if (e.keyCode == 107) find(vid);
            // if (e.keyCode == 109) if (find_status) find_status--;
            if (e.keyCode == 109) if ($('.kanji-list1').css('display') == 'flex') $('.kanji-list1').css('display', 'none'); else $('.kanji-panel').css('display', 'none')
            if (e.keyCode == 220) updateSavedKanjiList(kanji_list[vid].attr('id'));
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
                await sleep(100);
            }
        }
    })
    $('#right').on('mouseup', function(){
        // while(true) sleepTimer(10);
        // while(true) console.log(5);
        if (status == 'stop') down = false;
    })
    $('.checkbox').on('change', function(){
        let main = $(this);
        $('.checkbox').each(function() {
            if (main.attr('id') != $(this).attr('id')) {
                if ($(this).is(':checked')) $(this).prop('checked', false);
            }
        });
    });
    function setHandlers() {
        $('.kanji-panel-item').each(function() {
            $(this).click(function () {
                let id = $(this).attr('id');
                kanji = all_kanji_list['kanjiList'][id];

                console.log(all_kanji_list['kanjiList']);

                console.log(kanji);
        
                $('.kanji-list1').html('');
                $('.kanji-list1').css('display', 'flex');
        
                if (!kanji['on_reading']) kanji['on_reading'] = '-';
                if (!kanji['kun_reading']) kanji['kun_reading'] = '-';
                // $('.kanji-list').append("<div id=" + kanji['id'] + " class='block kanji-block' jlpt=" + kanji['JLPT'] + " style='display:none'><div class='id'>" + i + "</div><div class='kanji'>" + kanji['name'] + "</div><div class='name'>" + kanji['meaning'] + "</div><div class='on'>" + kanji['on_reading'] + "</div><div class='kun'>" + kanji['kun_reading'] + "</div></div>");
        
        
        
                // splitString(kanji['meaning'], ', ')
        
                // a = 'привет, как дела?';
                
                // a = a.split(', ');
        
                // alert(a.length);
                // alert(a[0]);
                // alert(a[1]);
        
                words = kanji['meaning'].split(', ');
        
                // $url = 'https://translate.google.com/?sl=en&tl=ru&text=be%20apprehensive&op=translate';
        
                url_start = 'https://translate.google.com/?sl=en&tl=ru&text=';
                url_end = '&op=translate';
        
                let kanji_id = kanji['id'] + 10000;
        
                $('.kanji-list1').append("<div id=" + kanji_id + " class='block kanji-block' jlpt=" + kanji['jlpt'] + " style='display:flex'></div>");
                $('#' + kanji_id).append("<div class='id'>" + id + "</div>");
                $('#' + kanji_id).append("<div class='kanji'>" + kanji['name'] + "</div>");
                // $('#' + kanji['id']).append("<div class='name'>" + kanji['meaning'] + "</div>");
                $('#' + kanji_id).append("<div class='name'></div>");
                for (let i = 0; i < words.length; i++) {
                    url = url_start;
                    parts = words[i].split(' ');
                    for (let j = 0; j < parts.length; j++) {
                        url += parts[j];
                        if (typeof parts[j+1] !== 'undefined') url += '%20';
                    }
                    url += url_end;
                    $('#' + kanji_id).children('.name').append("<a href=" + url + ">" + words[i] + "</a>");
                    if (typeof words[i+1] !== 'undefined') $('#' + kanji['id']).children('.name').append(', ');
                }
                $('#' + kanji_id).append("<div class='translate'>" + kanji['translate'] + "</div>");
                $('#' + kanji_id).append("<div class='on'>" + kanji['on_reading'] + "</div>");
                $('#' + kanji_id).append("<div class='kun'>" + kanji['kun_reading'] + "</div>");

                if (!kana_visibility) {
                    $('#' + kanji_id).children('.name').css('visibility', 'hidden');
                    $('#' + kanji_id).children('.translate').css('visibility', 'hidden');
                    $('#' + kanji_id).children('.on').css('visibility', 'hidden');
                    $('#' + kanji_id).children('.kun').css('visibility', 'hidden');
                }
                // else {
                //     kanji_list.forEach(kanji => {
                //         kanji.children('.name').css('visibility', 'visible');
                //         kanji.children('.translate').css('visibility', 'visible');
                //         kanji.children('.on').css('visibility', 'visible');
                //         kanji.children('.kun').css('visibility', 'visible');
                //     })
                //     kana_visibility = true;
                // }
        
                // $('.kanji-list2').append("<div id=" + kanji['id'] + " class='block kanji-block' jlpt=" + kanji['jlpt'] + " style='display:none'></div>");
                // // $('#' + kanji['id']).append("<div class='id'>" + i + "</div>");
                // $('#' + kanji['id']).append("<div class='kanji'>" + kanji['name'] + "</div>");
                // // $('#' + kanji['id']).append("<div class='name'>" + kanji['meaning'] + "</div>");
                // $('#' + kanji['id']).append("<div class='name'></div>");
                // for (let i = 0; i < words.length; i++) {
                //     url = url_start;
                //     parts = words[i].split(' ');
                //     for (let j = 0; j < parts.length; j++) {
                //         url += parts[j];
                //         if (typeof parts[j+1] !== 'undefined') url += '%20';
                //     }
                //     url += url_end;
                //     $('#' + kanji['id']).children('.name').append("<a href=" + url + ">" + words[i] + "</a>");
                //     if (typeof words[i+1] !== 'undefined') $('#' + kanji['id']).children('.name').append(', ');
                // }
                // $('#' + kanji['id']).append("<div class='translate'>" + kanji['translate'] + "</div>");
                // $('#' + kanji['id']).append("<div class='on'>" + kanji['on_reading'] + "</div>");
                // $('#' + kanji['id']).append("<div class='kun'>" + kanji['kun_reading'] + "</div>");
            });
        });
    }
    // async function getData() {
    //     // $('#right').trigger("mouseup");
    //     jlpt = $('#jlpt').val();
    //     if ($('#mode').is(':checked')) saved_mode = true;
    //     else saved_mode = false;
    //     if ($('#speed').val()) speed = $('#speed').val();
    //     else speed = 100;
    //     // if (github) {
    //         let decode_json = JSON.parse(json);
    //         let data = [];

    //         // decode_json.forEach(kanji => {
    //         //     saved_status_list.push(false);
    //         // });
    //         stopped = true;

    //         loadSavedKanjiList();

    //         while(stopped){
    //             await sleep(200);
    //         }

    //         saved_kanji_list.forEach(element => {
    //             saved_status_list[element - 1] = true;
    //         });

    //         if (saved_mode) {
    //             data = [];
    //                 saved_status_list.forEach(function(element, index) {
    //                     if (element == true) data.push(decode_json[index]);
    //                 });
    //         }
    //         else {
    //             if (jlpt) {
    //                 decode_json.forEach(kanji => {
    //                     if (kanji['JLPT'] == jlpt) data.push(kanji);
    //                 });
    //             }
    //             else data = decode_json;
    //         }

    //         data = divide(data);
    //         data = shuffle(data);
        
    //         build(data);
    //     // }
    // }
    async function getData() {
        jlpt = $('#jlpt').val();
        // if ($('#mode').is(':checked')) saved_mode = true;
        // else saved_mode = false;
        // if ($('#speed').val()) speed = $('#speed').val();
        // else speed = 100;

        saved_mode = $('#savedMode').is(':checked') ? true : false;
        baned_mode = $('#banMode').is(':checked') ? true : false;
        banedViewMode = $('#basketMode').is(':checked') ? true : false;
        speed = $('#speed').val() ? $('#speed').val() : 100;

        let form_data = new FormData();
        form_data.append('method', 'load');
        form_data.append('jlpt', jlpt);
        // form_data.append('kanji', vid);

        $.ajax({
            url: 'http://brandnewbo.temp.swtest.ru/test.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(php_script_response){
                if (php_script_response) {
                    let response = JSON.parse(php_script_response);

                    all_kanji_list = response;

                    console.log('kanji');
                    console.log(all_kanji_list);

                    banedViewStatus = banedViewMode ? false : true;
                    banedUnviewStatus = banedViewMode ? true : false;

                    response['kanjiList'].forEach(kanji => {
                        saved_status_list.push(false);
                        baned_status_list.push(false);
                    });

                    response['statusList'].forEach(function(element, index) {
                        saved_kanji_list.push(element);
                    });

                    response['banList'].forEach(function(element, index) {
                        baned_kanji_list.push(element);
                    });
                    
                    saved_kanji_list.forEach(element => {
                        saved_status_list[element - 1] = true;
                    });

                    baned_kanji_list.forEach(element => {
                        baned_status_list[element - 1] = true;
                    });

                    // if (baned_mode) {
                    //     baned_kanji_list.forEach(element => {
                    //         // baned_status_list[element - 1] = banedUnviewStatus;
                    //         delete saved_status_list[element - 1];
                    //         delete response['kanjiList'][element - 1];
                    //     });
                    //     saved_status_list = refresh(saved_status_list);
                    //     response['kanjiList'] = refresh(response['kanjiList']);
                    // }

                    data = [];

                    // response['kanjiList'].forEach(element => {
                    //     data.push(false);
                    // });
        
                    if (saved_mode) {
                        saved_status_list.forEach(function(element, index) {
                            if (element == true) data.push(response['kanjiList'][index]);
                            // if (element == true) data[index] = response['kanjiList'];
                        });
                    }
                    else {
                        if (jlpt) {
                            response['kanjiList'].forEach(kanji => {
                                if (kanji['jlpt'] == jlpt) data.push(kanji);
                                // if (kanji['jlpt'] == jlpt) data[index] = response['kanjiList'];
                            });
                        }
                        else data = response['kanjiList'];
                    }

                    // alert(data.length);
                    console.log('data.length=' + data.length);

                    // console.log(data);

                    // alert(baned_kanji_list.length);
                    console.log('baned_kanji_list.length' + baned_kanji_list.length);

                    // console.log(baned_kanji_list);

                    if (baned_mode) {
                        data = divide(data);
                        // baned_kanji_list.forEach(function(element, index) {
                        baned_kanji_list.forEach(kanji => {
                            // data.forEach(el => {
                            //     // alert(el['id']);
                            //     // if (el['id'] == element) alert(5);
                            //     if (el['id'] == element) delete el;
                            // });

                            data.forEach(function(element, index) {
                                // alert(el['id']);
                                // if (el['id'] == element) alert(5);
                                if (element['id'] == kanji) delete data[index];
                            });
                            
                            // if (element == true) {
                            //     // delete data[index];
                            //     // delete saved_status_list[index];

                            //     delete data[index];
                            //     delete saved_status_list[index];
                            // }
                        });

                        data = refresh(data);
                        // saved_status_list = refresh(saved_status_list);
                    }
                
                    // if (baned_mode) {
                    //     baned_kanji_list.forEach(function(element, index) {
                    //         if (response['kanjiList'][element]) delete response['kanjiList'][element];
                            
                    //         // if (element == true) {
                    //         //     // delete data[index];
                    //         //     // delete saved_status_list[index];

                    //         //     delete data[index];
                    //         //     delete saved_status_list[index];
                    //         // }
                    //     });

                    //     data = refresh(data);
                    //     saved_status_list = refresh(saved_status_list);
                    // }

                    // if (baned_mode) {
                    //     baned_status_list.forEach(function(element, index) {
                    //         if (element == true) {
                    //             // delete data[index];
                    //             // delete saved_status_list[index];

                    //             delete data[index];
                    //             delete saved_status_list[index];
                    //         }
                    //     });

                    //     data = refresh(data);
                    //     saved_status_list = refresh(saved_status_list);
                    // }

                    if (banedViewMode) {
                        data.forEach(function(element, index) {
                            let i;
                            baned_kanji_list.forEach(kanji => {
                                // if (element['id'] != kanji) alert(5);
                                if (element['id'] == kanji) i = true;
                            });
                            if (!i) delete data[index];
                        });

                        data = refresh(data);
                    }

                    // if (banedViewMode) {
                    //     baned_kanji_list.forEach(kanji => {
                    //         let i;
                    //         data.forEach(function(element, index) {
                    //             // if (element['id'] != kanji) alert(5);
                    //             if (element['id'] == kanji) i = true;
                    //         });
                    //         if (!i) delete data[index];
                    //     });

                    //     data = refresh(data);
                    // }

                    // alert(data.length)

                    // if (banedViewMode) {
                    //     baned_status_list.forEach(function(element, index) {
                    //         if (element == false) {
                    //             delete data[index];
                    //             delete saved_status_list[index];
                    //         }
                    //     });

                    //     data = refresh(data);
                    //     saved_status_list = refresh(saved_status_list);
                    // }

                    // data.forEach(element => {
                    //     if (!element) delete element;
                    // });

                    data = refresh(data);

                    // alert(data.length);

                    console.log('data');
                    console.log(data);
        
                    if (!baned_mode) data = divide(data);
                    // data = divide(data);

                    console.log('data1');
                    console.log(data);

                    data = shuffle(data);
                
                    build(data);
                }
            }
        });
    }
    function shift() {
        if (kana_visibility) {
            kanji_list.forEach(kanji => {
                kanji.children('.name').css('visibility', 'hidden');
                kanji.children('.translate').css('visibility', 'hidden');
                kanji.children('.on').css('visibility', 'hidden');
                kanji.children('.kun').css('visibility', 'hidden');
            })
            kana_visibility = false;
        }
        else {
            kanji_list.forEach(kanji => {
                kanji.children('.name').css('visibility', 'visible');
                kanji.children('.translate').css('visibility', 'visible');
                kanji.children('.on').css('visibility', 'visible');
                kanji.children('.kun').css('visibility', 'visible');
            })
            kana_visibility = true;
        }

        if ($('.kanji-list1').html() != '') {
            if (kana_visibility) {
                $('.kanji-list1').children('div').children('.name').css('visibility', 'visible');
                $('.kanji-list1').children('div').children('.translate').css('visibility', 'visible');
                $('.kanji-list1').children('div').children('.on').css('visibility', 'visible');
                $('.kanji-list1').children('div').children('.kun').css('visibility', 'visible');
            } else {
                $('.kanji-list1').children('div').children('.name').css('visibility', 'hidden');
                $('.kanji-list1').children('div').children('.translate').css('visibility', 'hidden');
                $('.kanji-list1').children('div').children('.on').css('visibility', 'hidden');
                $('.kanji-list1').children('div').children('.kun').css('visibility', 'hidden');
            }
        }
    }
    function ctrl() {
        if (button_visibility) {
            $('button').each(function() {
                $(this).css('display', 'none');
            })
            $('#ctrl').css('display', 'block');
            $('#ctrl').css('left', '0');
            $('#ctrl').css('width', '100vw');
            $('#ctrl').css('height', '30px');
            button_visibility = false;
        }
        else {
            $('button').each(function() {
                $(this).css('display', 'block');
            })
            $('#ctrl').css('display', 'block');
            $('#ctrl').css('left', '80px');
            $('#ctrl').css('width', '80px');
            $('#ctrl').css('height', '80px');
            button_visibility = true;
        }
    }
    function basckspace() {
        kanji_list = [];
        // baned_mode;
        // banedViewMode;
        saved_status_list = [];
        baned_status_list = [];
        saved_kanji_list = [];
        baned_kanji_list = [];
        kana_visibility = false;
        button_visibility = false;
        vid = null;
        status = false;
        down = false;
        pid = 0;
        $('.kanji-list').html('');
        $('#start').css('display', 'flex');
    }
    async function run(id, pid_temp) {
        status = 'run';

        // if (baned_mode) {
        //     // alert(1);
        //     findedActiveKanji = setActiveKanji(id, 1);
        //     if (findedActiveKanji === false) {
        //         // vid = id-1
        //         // delete kanji_list[id];
        //         // alert(5);
        //         status = 'stop';
        //         return true;
        //     }
        //     id = findedActiveKanji;
        // }
        if (vid) kanji_list[vid].css('display', 'none');
        for (let i = id; i < kanji_list.length; i++) {
            if (status == 'run' && pid == pid_temp) {
                if (kanji_list[i-1]) kanji_list[i-1].css('display', 'none');
                // if (baned_mode) i = setActiveKanji(i, 1);
                kanji_list[i].css('display', 'flex');
                if (i == kanji_list.length - 1) status = 'stop';
                vid = i;
                await sleep(speed);
            }
            else break;
        }
    }
    function change(id) {
        console.log(kanji_list.length);
        // if (baned_mode) {
        //     // id = id > vid ? id - 1 : id + 1;
        //     // findedActiveKanji = id > vid ? setActiveKanji(id, 1) : setActiveKanji(id, 0);
        //     console.log(vid);
        //     findedActiveKanji = id > vid ? setActiveKanji(vid+1, 1) : setActiveKanji(vid-1, 0);
        //     if (findedActiveKanji === false) {
        //         // vid = id > vid ? id-1 : id+1;
        //         // delete kanji_list[id];
        //         return true;
        //     }
        //     id = findedActiveKanji;
        // }
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
            // $('.kanji-list').append("<div id=" + kanji['id'] + " class='block kanji-block' jlpt=" + kanji['JLPT'] + " style='display:none'><div class='id'>" + i + "</div><div class='kanji'>" + kanji['name'] + "</div><div class='name'>" + kanji['meaning'] + "</div><div class='on'>" + kanji['on_reading'] + "</div><div class='kun'>" + kanji['kun_reading'] + "</div></div>");



            // splitString(kanji['meaning'], ', ')

            // a = 'привет, как дела?';
            
            // a = a.split(', ');

            // alert(a.length);
            // alert(a[0]);
            // alert(a[1]);

            words = kanji['meaning'].split(', ');

            // $url = 'https://translate.google.com/?sl=en&tl=ru&text=be%20apprehensive&op=translate';

            url_start = 'https://translate.google.com/?sl=en&tl=ru&text=';
            url_end = '&op=translate';

            $('.kanji-list').append("<div id=" + kanji['id'] + " class='block kanji-block' jlpt=" + kanji['jlpt'] + " style='display:none'></div>");
            $('#' + kanji['id']).append("<div class='id'>" + i + "</div>");
            $('#' + kanji['id']).append("<div class='kanji'>" + kanji['name'] + "</div>");
            // $('#' + kanji['id']).append("<div class='name'>" + kanji['meaning'] + "</div>");
            $('#' + kanji['id']).append("<div class='name'></div>");
            for (let i = 0; i < words.length; i++) {
                url = url_start;
                parts = words[i].split(' ');
                for (let j = 0; j < parts.length; j++) {
                    url += parts[j];
                    if (typeof parts[j+1] !== 'undefined') url += '%20';
                }
                url += url_end;
                $('#' + kanji['id']).children('.name').append("<a href=" + url + ">" + words[i] + "</a>");
                if (typeof words[i+1] !== 'undefined') $('#' + kanji['id']).children('.name').append(', ');
            }
            $('#' + kanji['id']).append("<div class='translate'>" + kanji['translate'] + "</div>");
            $('#' + kanji['id']).append("<div class='on'>" + kanji['on_reading'] + "</div>");
            $('#' + kanji['id']).append("<div class='kun'>" + kanji['kun_reading'] + "</div>");

            // id1 = kanji['id'] + 10000;

            // $('.kanji-list1').append("<div id=" + id1 + " class='block kanji-block1' jlpt=" + kanji['jlpt'] + " style='display:none'></div>");
            // $('#' + id1).append("<div class='id'>" + i + "</div>");
            // $('#' + id1).append("<div class='kanji'>" + kanji['name'] + "</div>");
            // // $('#' + kanji['id']).append("<div class='name'>" + kanji['meaning'] + "</div>");
            // $('#' + id1).append("<div class='name'></div>");
            // for (let i = 0; i < words.length; i++) {
            //     url = url_start;
            //     parts = words[i].split(' ');
            //     for (let j = 0; j < parts.length; j++) {
            //         url += parts[j];
            //         if (typeof parts[j+1] !== 'undefined') url += '%20';
            //     }
            //     url += url_end;
            //     $('#' + id1).children('.name').append("<a href=" + url + ">" + words[i] + "</a>");
            //     if (typeof words[i+1] !== 'undefined') $('#' + kanji['id']).children('.name').append(', ');
            // }
            // $('#' + id1).append("<div class='translate'>" + kanji['translate'] + "</div>");
            // $('#' + id1).append("<div class='on'>" + kanji['on_reading'] + "</div>");
            // $('#' + id1).append("<div class='kun'>" + kanji['kun_reading'] + "</div>");

            // $('.kanji-list').append("<div id=" + kanji['id'] + " class='block kanji-block' jlpt=" + kanji['JLPT'] + " style='display:none'><div class='id'>" + i + "</div><div class='kanji'>" + kanji['name'] + "</div><div class='name'>" + kanji['meaning'] + "</div><div class='on'>" + kanji['on_reading'] + "</div><div class='kun'>" + kanji['kun_reading'] + "</div></div>");
            i++;
        });
        kanji_list = [];
        $('.kanji-block').each(function() {
            kanji_list.push($(this));
        });
        kanji_list.forEach(kanji => {
            if (saved_status_list[kanji.attr('id') - 1]) kanji.children('.kanji').css('color', 'green');
        });
        kana_visibility = true;
        shift();
        // alert(kanji_list.length);

        if (dark_mode) {
            $('html').css('background-color', 'white');
            // $('body').css('color', colors[activeColor]);
            dark_mode = false;
            changeBackColorMode();
        }
        run(0, pid);
    }

    // function loadSavedKanjiList() {
        
    //     let form_data = new FormData();
    //     form_data.append('method', 'load');
    //     form_data.append('jlpt', jlpt);
    //     form_data.append('kanji', vid);

    //     $.ajax({
    //         url: 'test.php',
    //         dataType: 'text',
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         data: form_data,
    //         type: 'post',
    //         success: function(php_script_response){
    //             if (php_script_response) {
    //                 let data = JSON.parse(php_script_response);

    //                 data['kanjiList'].forEach(kanji => {
    //                     saved_status_list.push(false);
    //                 });

    //                 data['statusList'].forEach(function(element, index) {
    //                     saved_kanji_list.push(element);
    //                 });
    //             }
    //             stopped = false;
    //         }
    //     });
    // }

    function updateSavedKanjiList(id) {
        if (saved_status_list[id - 1]) {
            saved_status_list[id - 1] = false;
            method = 'delete';
        }
        else {
            saved_status_list[id - 1] = true;
            method = 'save';
        }
        if (saved_status_list[kanji_list[vid].attr('id') - 1]) kanji_list[vid].children('.kanji').css('color', 'green');
        // else kanji_list[vid].children('.kanji').css('color', 'black');
        else {
            if (dark_mode) kanji_list[vid].children('.kanji').css('color', 'white');
            else kanji_list[vid].children('.kanji').css('color', 'black');
        }

        // alert(kanji_list[vid].attr('jlpt'));

        // console.log(kanji_list[vid]);

        // return;

        let form_data = new FormData();
        form_data.append('method', method);
        form_data.append('jlpt', kanji_list[vid].attr('jlpt'));
        form_data.append('kanji', id);

        $.ajax({
            url: 'http://brandnewbo.temp.swtest.ru/test.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post'
        });
    }

    function banKanji() {
        if (load_status) return false;
        load_status = true;
        if (!kanji_list[vid]) return false;

        let form_data = new FormData();
        form_data.append('method', baned_mode ? 'ban' : 'unban');
        form_data.append('jlpt', kanji_list[vid].attr('jlpt'));
        form_data.append('kanji', kanji_list[vid].attr('id'));

        $.ajax({
            url: 'http://brandnewbo.temp.swtest.ru/test.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(){
                kanji_list[vid].css('display', 'none');

                // delete saved_status_list[vid];
                delete kanji_list[vid];
                // saved_status_list = refresh(saved_status_list);
                kanji_list = refresh(kanji_list);
        
                if (kanji_list[vid]) kanji_list[vid].css('display', 'flex');
                else if (kanji_list[vid-1]) {
                    kanji_list[vid-1].css('display', 'flex');
                    vid = vid - 1;
                }
                load_status = false;
            }
        });
    }

    // function banKanji() {
    //     if (!kanji_list[vid]) return false;
    //     kanji_list[vid].css('display', 'none');

    //     delete saved_status_list[vid];
    //     delete kanji_list[vid];
    //     saved_status_list = refresh(saved_status_list);
    //     kanji_list = refresh(kanji_list);

    //     if (kanji_list[vid]) kanji_list[vid].css('display', 'flex');
    //     else if (kanji_list[vid-1]) {
    //         kanji_list[vid-1].css('display', 'flex');
    //         vid = vid - 1;
    //     }
    //     // else true;

    //     let form_data = new FormData();
    //     form_data.append('method', baned_mode ? 'ban' : 'unban');
    //     form_data.append('jlpt', kanji_list[vid].attr('jlpt'));
    //     form_data.append('kanji', kanji_list[vid].attr('id'));

    //     $.ajax({
    //         url: 'test.php',
    //         dataType: 'text',
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         data: form_data,
    //         type: 'post'
    //     });
    // }

    function divide(array) {
        amount = $('#amount').val();
        number = $('#number').val();

        console.log('amount=' + amount);
        console.log('number=' + number);

        if (!number) number = 1;
        if (!amount) return array;

        realNumber = Math.ceil(array.length / amount);

        if (number > realNumber) return;
        if (number == realNumber) {
            sum = array.length % amount;
            if (!sum) sum = amount;
        }
        else sum = amount;

        let data = [];

        for (let i = 0; i < sum; i++) {
            data.push(array[(number-1) * amount + i]);
            
        }

        return data;
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

    function changeBackColorMode(changeMode = null) {
        console.log('activeColor=' + activeColor);
        // if (changeMode && !dark_mode) return;
        let color = colors[activeColor];
        if (changeMode) {
            if (!dark_mode) return;
            activeColor = activeColor + changeMode;
            if (!colors[activeColor]) {
                if (changeMode == 1) activeColor = 0;
                else activeColor = colors.length - 1;
            } 
            color = colors[activeColor]
        }
        if (dark_mode) {
            if (!changeMode) {
                $('html').css('background-color', 'white');
                $('body').css('color', 'black');
                dark_mode = false;
            }
            else {
                $('body').css('color', color);
            }
        }
        else {
            $('html').css('background-color', 'black');
            // $('body').css('color', 'white');
            // $('body').css('color', 'brown');
            // $('body').css('color', 'yellow');
            $('body').css('color', colors[activeColor]);
            dark_mode = true;
        }
        if (!kanji_list) return;
        kanji_list.forEach(kanji => {
            if (saved_status_list[kanji.attr('id') - 1]) kanji.children('.kanji').css('color', 'green');
            else {
                // if (dark_mode) kanji.children('.kanji').css('color', 'white');
                // if (dark_mode) kanji.children('.kanji').css('color', 'brown');
                // if (dark_mode) kanji.children('.kanji').css('color', 'yellow');
                if (dark_mode) kanji.children('.kanji').css('color', color);
                else kanji.children('.kanji').css('color', 'black');
            }
        });
    }

    function refresh(array) {
        resultArray = [];
        array.forEach(function(element) {
            resultArray.push(element);
        });
        return resultArray;
    }

    function find(id) {
        let form_data = new FormData();
        form_data.append('method', 'find');
        form_data.append('id', kanji_list[vid].attr('id'));

        $.ajax({
            url: 'http://brandnewbo.temp.swtest.ru/test.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(php_script_response){
                if (php_script_response) {
                    let response = JSON.parse(php_script_response);
                    console.log(response);

                    $('.kanji-panel').html('');

                    if ($('.kanji-list1').css('display') == 'flex') $('.kanji-list1').css('display', 'none');
                    $('.kanji-panel').css('display', 'flex');

                    response.forEach(element => {
                        // let id = element + 10000;
                        let id = element;
                        $('.kanji-panel').append("<div id=" + id + " class='kanji-panel-item'>" + all_kanji_list['kanjiList'][element]['name'] + "</div>");
                    });

                    setHandlers();
                }
            }
        })
    }

    // function setActiveKanji(id, direction) {
    //     // while (!baned_status_list[vid]) {
    //     //     if (!kanji_list[vid]) return false;
    //     //     direction ? vid++ : vid--;
    //     // }
    //     // id = vid;
    //     // if (!vid) vid = 0;
    //     // id = direction ? vid+1 : vid-1;
    //     // id = direction ? id+1 : id-1;
    //     console.log(id);
    //     if (baned_status_list[direction ? id - 2 : id]) direction ? id++ : id--;
    //     while (true) {
    //         // direction ? id++ : id--;
    //         if (!kanji_list[id]) {
    //             // delete kanji_list[id];
    //             alert('id=' + id);
    //             return false;
    //         }
    //         if (!baned_status_list[id]) break;
    //         direction ? id++ : id--;

    //         // if (!baned_status_list[id]) {
    //         //     direction ? id++ : id--;
    //         //     break;
    //         // }
    //     }
    //     // if (!vid) vid = 1;
    //     // id = direction ? vid+1 : vid-1;
    //     // while (true) {
    //     //     if (!kanji_list[id]) {
    //     //         // delete kanji_list[id];
    //     //         return false;
    //     //     }
    //     //     if (!baned_status_list[id]) direction ? id++ : id--;
    //     //     break;
    //     // }
    //     // vid = id;
    //     return id;
    // }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function sleepTimer(ms) {
        timer += ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
