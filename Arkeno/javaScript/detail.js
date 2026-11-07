// Design Credit: https://www.instagram.com/p/CfMJnkuDFFq/

const api = [
  {img: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ffb%2F9f%2Ffb9f94d3ddd8546f6d02119d532f1ac478733492.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]',color: '#212021',name: 'Black'},
  {img: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fdb%2Faf%2Fdbafcb2ebe0fa9e9cf94ec7935b13f9c4b787d5a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]',color: '#3D2325',name: 'Dark brown'},
  {img: 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fa9%2F76%2Fa9760f030ddddc65e2d5d039c8cbe3683769441d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]',color: 'white',name: 'White'},

]

const optionsbtn = document.querySelector('.more-options-btn');

optionsbtn.addEventListener('click', () =>{
   document.querySelector('.more-options').classList.toggle('show-options')
  
  anime({
    targets: '.more-options',
    scaleY: [0,1],
    duration: 1000,

  })
  
  anime({
    targets: '.icon-anim',
    scale: [0,1],
    opacity: [0,1],
    delay: function(el,i){
       return (i * 160) + 300;
    }
  })
  
})

function replacebg(array,element,index){
  element.style.backgroundImage = `url(${array[index].img})`;
}

 replacebg(api,document.querySelector('.image-container'),0);


let count = 0;

document.querySelector('.image-change-icon').addEventListener('click', () =>{
  
  if(count == api.length -1){
       count = 0;
  }
  
  else {
     count++
  }


 replacebg(api,document.querySelector('.image-container'),count);
})

function createcolors(array,appendto){
  let allcolors = [];
  
   array.forEach(function(el,i){
     const coloritem = document.createElement('div');
     coloritem.style.background = array[i].color;
     coloritem.title = array[i].name;
     coloritem.classList.add('color-item');
     appendto.appendChild(coloritem);
     allcolors.push(coloritem)
   })
  
  return allcolors;
}

const allcolors = createcolors(api,document.querySelector('.available-colors'))

allcolors.forEach(function(el,i){
   allcolors[i].addEventListener('click', (e) =>{
     api.forEach(function(el,i){
        if(api[i].name == e.target.title){
          document.querySelector('.image-container').style.backgroundImage = `url(${api[i].img})`
          count = i;
        }
     })
   })
})

document.querySelector('.heart-icon').addEventListener('click', () =>{
     document.querySelector('.heart-icon').classList.toggle('bi-heart')

   document.querySelector('.heart-icon').classList.toggle('bi-heart-fill')
})