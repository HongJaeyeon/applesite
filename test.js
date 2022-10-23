(() => {

    // 현재 스크롤 위치를 지나온 scene들의 합과 비교해보면
    // 내가 지금 어디 씬을 재생해야하는지 알 수 있음
    // 지나온 씬의 합이 prescrollheight
    // yOffset 지금 내 y위치 (스크롤 위치)
    // currentscene 지금 내가 어느 씬을 재생해야하는지 저장해둘 변수
    let yOffset = 0;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let changeScene = false;

    const sceneInfo = [
        {//0
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            //각 브라우저에서 창의 크기가 다르니까 스크롤의 길이가 다른데 
            //모든 디바이스에서 똑같은 체험을 할수 있도록 똑같은 배수를 곱해줌
            //스크롤의 높이가 window.innerheight 인거고 heightnum이 그 배수
            values: {
                messageA_opacity_in: [0, 1, {start : 0.1, end: 0.2}], //total = 1
                messageA_translateY_in: [20, 0 ,{start : 0.1, end: 0.2}],
                messageA_opacity_out: [1, 0, {start : 0.25, end: 0.3}],
                messageA_translateY_out: [0, -20 ,{start : 0.25, end: 0.3}],
                messageB_opacity_in: [0, 1, {start : 0.3, end: 0.4}],
            }
        },

        {//1
            type: 'nomal',
            scrollHeight: 0,
            heightNum: 5, 
            objs: {
                container: document.querySelector('#scroll-section-1')
            },
        },

        {//2
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5, 
            objs: {
                container: document.querySelector('#scroll-section-2')
            },
        },

        {//3
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5, 
            objs: {
                container: document.querySelector('#scroll-section-3')
            },
        }
    ];

    function setLayout(){
        for (let i =0; i< sceneInfo.length; i++){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight -500}px`;
        }

    // 페이지를 바로 딱 틀었을 때 지금 내가 어디있는지 알려면?
        let totalScrollHeight = 0;
        for (let i=0; i< sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset ){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

    }

  function calcValues(values, currentYOffset){
    //currentYOffset : 지금 현재 스크롤 section에서의 나의 스크롤 위치 
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3 ){
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

        
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1]-values[0]) + values[0] ; 
                //partScrollStart 시작 '포인트' '위치', 현재 이 씬에서 내 위치인 currentYOffset에서 그 시작 포인트를 빼주면 시작 후부터의 스크롤만 남음
                //스크롤이 시작 후 부터에 있는지는 if로 걸러서 확실하고 그럼 결과적으로 이 씬에서의 나의 스크롤이 아니라 시작 포인트부터 나의 스크롤에 대한 비례 식이 나오게 됨
            } else if (currentYOffset <  partScrollStart){
                rv = values[0];
            } else if (currentYOffset > partScrollEnd){
                rv = values[1];
            }
        } else {
            rv = scrollRatio * values[1]-values[0] + values[0]; 
        }
 
        // 만약 범위가 [200,900]이면 값은 200부터 시작해서 700더한 900까지 움직여야함
        return rv;
  }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset-prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        switch(currentScene){
            case 0:
            if (scrollRatio <= 0.22){                
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)})`;
            } else{                
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset); 
                objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)})`
            }

                //현재 씬의 현재 스크롤값과 [0,1]까지 설정한 범위를 넘겨서 계속 지금 투명도가 어때야하는지 받아옴 
                //그럼 스크롤 위치에 비례한 0~1까지의 투명도 값을 가지게 됨
                break;
            case 1:
                break;
            case 2:          
                break;
            case 3:       
                break;
        }
    }
    // currentscenn이 2일 때 for문은 0,1 2번 돎
    // sceneInfo[i].scrollHeight; -> 각 페이지의 스크롤 양
    // 0번 페이지의 스크롤양 더하기 1번 페이지 더하기 스크롤양
    function scrollLoop() {
        prevScrollHeight = 0;
        changeScene = false;
        for(let i =0; i< currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        // 내가 지금 있는 위치가 이전에 지나온 씬들에다가 지금 현재 씬 더한거 보다 큼
        // 다음 페이지로 넘어가려고 하는 것
        // currentsceen ++
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){  
            currentScene++;
            changeScene = true;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        // 내 현재 위치가 이전에 지나온 씬들보다 작음
        // 다시 스크롤을 위로 올리는 상태.
        // current --
        if (yOffset < prevScrollHeight){
            changeScene = true;
            if(currentScene == 0) return; //bouns except
            document.body.setAttribute('id', `show-scene-${currentScene}`);
            currentScene--;
        }
        if (changeScene) return;
        //scene이 바뀌는 순간에
        // scroll의 변화에 따라 음수값이나 이상한 값이 들어오는데
        // playanimation을 생략함 즉 투명도 계산을 생략함
        console.log("currentScene :" +currentScene);
        playAnimation();
    };

    window.addEventListener('scroll', () =>{
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    window.addEventListener('Load', setLayout);
    window.addEventListener('resize', setLayout);
    setLayout();

}) (); //same (funtion ()) ();
