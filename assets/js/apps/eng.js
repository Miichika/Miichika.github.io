
        let config = {
            "language":"EN",
            "rating":"G"
        }


        $(document).ready(function () {
            $('#carouselModalIndicators').on('slide.bs.carousel', function (e) {
                $('.thumb').removeClass('active');
                $('.thumb').eq(e.to).addClass('active');
            });


            $('.thumb').eq(0).addClass('active');


            var carousel = $('#carouselModalIndicators');

            $('#autoSlideToggle').change(function () {
              if ($(this).is(':checked')) {
                carousel.carousel('cycle');
              } else {
                carousel.carousel('pause');
              }
            });

            if (!$('#autoSlideToggle').is(':checked')) {
              carousel.carousel('pause');
            }

            let imgResReDrawAnime = generateImagePage(dataImageReDrawAnime);
            $("#imagePageReDrawAnime").html(imgResReDrawAnime);

            let imgRes = generateImagePage(dataImage);
            $("#imagePageMizugiParty").html(imgRes);

            let imgResBudgeHuntDeviantArt = generateImagePage(dataImageBadgeHunt, {'col-config':'col-3'});
            $("#imagePageBudgeHuntDeviantArt").html(imgResBudgeHuntDeviantArt);


            let imgResBudgeDreamUp = generateImagePage(dataImageDreamUpAi, {'col-config':'col-12', 'galery-row-config':'galleryRowList'});
            $("#imagePageBudgeDreamUp").html(imgResBudgeDreamUp);
            

            let imgResOriginalCharacter = generateImageExtraPage(dataImageOriginalCharacter);
            $("#imagePageOriginalCharacter").html(imgResOriginalCharacter);




            $('.galleryRow').click(function(){

                $("#imageLists").html("");
                $("#imageRails").html("");
                let id = $(this).attr('data-id');

                // console.log(id);
                // console.log(dataImage);

                let singleData = searchDataById(dataImage, id);
                let socialLinkData = generateSocialLink(singleData['published_link']);
                let imageLoadData = generateImageList(singleData);
                let detailData = {};
    
                if (config['language'] == 'EN') {
                    detailData = singleData['detail']['en']
                }

                console.log(detailData['title']);
                console.log(detailData);
                console.log(socialLinkData);
                console.log(imageLoadData['view']);
                console.log(imageLoadData['thumbnail']);

                $('#projectModalTitle').text(detailData['title']);
                $('#projectModalDecribes').html(detailData['describe']);
                $("#projectModalSocialButton").html(socialLinkData);
                $("#imageLists").html(imageLoadData['view']);
                $("#imageRails").html(imageLoadData['thumbnail']);

                console.log(singleData);
                $("#sliderModal").modal('show');

            });

            function searchDataById(data, id){
                let obj = data.find(o => o.id === id);
                return obj;
            }

            function generateSocialLink(data) {
                let result = "";

                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['name'] == 'Pinterest' && data[i]['url'] != '-') {
                        let socialButton = '<a href="'+data[i]['url']+'"><span class="fab fa-deviantart"></span></a>';
                        result = result+socialButton;
                    }
                    else if (data[i]['name'] == 'Deviantart' && data[i]['url'] != '-') {
                        let socialButton = '<a href="'+data[i]['url']+'"><span class="fab fa-pinterest"></span></a>';
                        result = result+socialButton;
                    }
                    else if (data[i]['name'] == 'Pixiv' && data[i]['url'] != '-') {
                        let socialButton = '<a href="'+data[i]['url']+'"><span class="fa-brands fa-pixiv"></span></a>';
                        result = result+socialButton;

                    }
                }

                return result;
            }


            function generateImageList(data) {
                console.log(data);
                let result = {};
                let resultData = "";
                let resultImgThumbnail = "";

                if (data['type'] == 'sub-gallery') {
                    for (let i = 0; i < data['image'].length; i++) {
                        let imgRow = "";
                        if (i == 0) {
                            imgRow = 
                            `<div class="carousel-item active">                    
                                <img src="`+data['image'][i]+`" class="d-block w-100" alt="...">  
                            </div>`;
                        }else{
                            imgRow = 
                            `<div class="carousel-item">                    
                                <img src="`+data['image'][i]+`" class="d-block w-100" alt="...">  
                            </div>`;
                        }

                        let imgThumbnail = `<img src="`+data['image'][i]+`" class="thumb img-thumbnail" data-bs-target="#carouselModalIndicators" data-bs-slide-to="`+i+`">`;

                        resultData = resultData+imgRow;
                        resultImgThumbnail = resultImgThumbnail+imgThumbnail;
                    }
                    
                }else if (data['type'] == 'single') {
                    let imgRow = 
                        `<div class="carousel-item active">                    
                            <img src="`+data['image']+`" class="d-block w-100" alt="...">  
                        </div>`;

                    resultData = imgRow;
                }
                result['view'] = resultData;
                result['thumbnail'] = resultImgThumbnail;

                return result;
            }

            function generateImagePage(data, customize = null) {
                let result = "";
                let detailData = "";
                let resultData = "";
                let customizeData = "";
                let colConfig = "col-2";
                let galleryRowConfig = "galleryRow";
                if (customize) {
                    customizeData = customize
                }



                for (let i = 0; i < data.length; i++) {

                    if (config['language'] == 'EN') {
                        detailData = data[i]['detail']['en']
                    }else if(config['language'] == 'JP') {
                        detailData = data[i]['detail']['jp']
                    }

                    // console.log(detailData);
                    let getName = generateImageName(detailData['title']);
                    let singleData = data[i];

                    let getImage = '';
                    if (typeof singleData['image'] === 'string') {
                        getImage = singleData['image'];
                    }else{
                        getImage = singleData['image'][0];
                    }

                    if(customizeData['col-config'] != null){
                        colConfig = customizeData['col-config']
                    }
                    if(customizeData['galery-row-config'] != null){
                        galleryRowConfig = customizeData['galery-row-config']
                    }
                    
                        // `+galleryRowConfig+`

                    let composeImg = 
                        `<div class="`+colConfig+`">
                            <div data-id="`+singleData['id']+`" class="`+galleryRowConfig+`" style="background-image: url(`+getImage+`); `+singleData['style']['img']+`">
                                <div class="overlayRowBody" style="`+singleData['style']['overlay']+`"></div>
                                `+getName+`
                            </div>
                        </div>`
                    resultData = resultData+composeImg;
                    
                }

                return resultData;







                // if (data['type'] == 'sub-gallery') {
                //     for (let i = 0; i < data['image'].length; i++) {
                //         let imgRow = "";
                //         if (i == 0) {
                //             imgRow = 
                //             `<div class="carousel-item active">                    
                //                 <img src="`+data['image'][i]+`" class="d-block w-100" alt="...">  
                //             </div>`;
                //         }else{
                //             imgRow = 
                //             `<div class="carousel-item">                    
                //                 <img src="`+data['image'][i]+`" class="d-block w-100" alt="...">  
                //             </div>`;
                //         }

                //         let imgThumbnail = `<img src="`+data['image'][i]+`" class="thumb img-thumbnail" data-bs-target="#carouselModalIndicators" data-bs-slide-to="`+i+`">`;

                //         resultData = resultData+imgRow;
                //         resultImgThumbnail = resultImgThumbnail+imgThumbnail;
                //     }
                    
                // }else if (data['type'] == 'single') {
                //     let imgRow = 
                //         `<div class="carousel-item active">                    
                //             <img src="`+data['image']+`" class="d-block w-100" alt="...">  
                //         </div>`;

                //     resultData = imgRow;
                // }
                // result['view'] = resultData;
                // result['thumbnail'] = resultImgThumbnail;

                // return result;
            }

            function generateImageExtraPage(data, customize = null) {
                let result = "";
                let detailData = "";
                let resultData = "";
                let customizeData = "";
                let colConfig = "col-2";
                let galleryRowConfig = "galleryRow";
                if (customize) {
                    customizeData = customize
                }



                for (let i = 0; i < data.length; i++) {

                    if (config['language'] == 'EN') {
                        detailData = data[i]['detail']['en']
                    }else if(config['language'] == 'JP') {
                        detailData = data[i]['detail']['jp']
                    }

                    // console.log(detailData);
                    let getName = generateImageName(detailData['title']);
                    let singleData = data[i];

                    let getImage = '';
                    if (typeof singleData['image'] === 'string') {
                        getImage = singleData['image'];
                    }else{
                        getImage = singleData['image'][0];
                    }

                    if(customizeData['col-config'] != null){
                        colConfig = customizeData['col-config']
                    }
                    if(customizeData['galery-row-config'] != null){
                        galleryRowConfig = customizeData['galery-row-config']
                    }
                    
                        // `+galleryRowConfig+`

                    let composeImg = 
                        `<div data-id="`+singleData['id']+`" class="galleryRow rounded-4" style="background-image: url(`+getImage+`);  `+singleData['style']['img']+`">
                                <div class="overlayRowBody oc-overlay" style="`+singleData['style']['overlay']+`"></div>
                                 `+getName+`
                        </div>`;

                    if (i == 0) {
                        composeImg = '<div class="col-8">'+composeImg+'</div>';
                    }else if(i == 1){
                        composeImg = '<div class="col-4">'+composeImg;
                    }else if(data.length == i){
                        composeImg = composeImg+'</div>';
                    }


                    resultData = resultData+composeImg;
                    
                }

                return resultData;

            }


            function generateImageName(name){

                let eachWordHtml = "";
                let nameLenght = parseInt(name.length);
                
                for (let i = 0; i < nameLenght; i++) {
                    if (name[i] == ' ') {
                        eachWordHtml = eachWordHtml+'<div class="eachCharacterName"  style="    background: rgb(221 221 221 / 35%);padding: 10px;border-bottom: 0;">'+name[i]+'</div>';
                    }else{
                        eachWordHtml = eachWordHtml+'<div class="eachCharacterName">'+name[i]+'</div>';
                    }
                    
                }
                return result = ` <div id="name-ID" class="overlayTitle"> `+eachWordHtml+`</div>`;
            }



        });




        // window.onload = () => {
        //     $('#onload').modal('show');
        // }

        function about(){
            $('#profile').modal('show');
        }

        document.querySelector('.sidebar-toggle').addEventListener('click', function () {
            document.getElementById('sidebar').classList.toggle('hide');
            document.querySelector('.gallery-container').classList.toggle('hide-sidebar');
        });

            // {
            //     "id":"",
            //     "type":"", //sub-gallery / single
            //     "image":"",
            //     "author":"",
            //     "published_link":{
            //         "pinterest":"",
            //         "pixiv":"",
            //         "deviantart":""
            //     },
            //     "detail":{
            //         "en":{
            //             "title":"",
            //             "describe":"",
            //             "path":"",
            //         },
            //         "jp":{}                    
            //     }

            // },
