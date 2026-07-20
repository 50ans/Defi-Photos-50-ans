/* =====================================================
   LES 50 ANS DE PAPA
   Application photo collaborative
===================================================== */


/* ==========================
   VARIABLES
========================== */


const pages = document.querySelectorAll(".page");


let currentChallenge = {
    title: "Le radeau de la Méduse",
    description: "Reproduisez une œuvre célèbre avec les invités.",
    id: 1
};


let selectedFile = null;



/* ==========================
   NAVIGATION
========================== */


function showPage(id){


    pages.forEach(page=>{

        page.classList.remove("active");

    });


    document
    .getElementById(id)
    .classList.add("active");


}



document
.querySelectorAll(".navigation button")
.forEach(button=>{


    button.addEventListener("click",()=>{


        showPage(button.dataset.page);


    });


});





document
.getElementById("start")
.onclick=()=>{

    showPage("challenge");

};





document
.querySelectorAll(".back")
.forEach(btn=>{


    btn.onclick=()=>{


        showPage("home");


    };


});





document
.getElementById("photo")
.onclick=()=>{


    showPage("upload");


};





document
.getElementById("again")
.onclick=()=>{


    showPage("challenge");


};







/* ==========================
   QR CODE / DEFI
========================== */


function loadChallenge(){


    const params =
    new URLSearchParams(
        window.location.search
    );


    const defi =
    params.get("defi");



    if(defi){


        currentChallenge.title =
        decodeURIComponent(defi);


        document
        .getElementById("challengeTitle")
        .textContent =
        currentChallenge.title;


    }


}



loadChallenge();







/* ==========================
   PHOTO PREVIEW
========================== */


const input =
document.getElementById("file");


const preview =
document.getElementById("preview");


const empty =
document.getElementById("empty");




input.addEventListener(
"change",
()=>{


    const file =
    input.files[0];


    if(!file)
    return;



    selectedFile=file;



    const reader =
    new FileReader();



    reader.onload=function(e){


        preview.src=e.target.result;


        preview.style.display="block";


        empty.style.display="none";


    }



    reader.readAsDataURL(file);



});







/* ==========================
   COMPRESSION IMAGE
========================== */


async function compressImage(file){


return new Promise(resolve=>{


const img=new Image();


const canvas=document.createElement("canvas");


img.onload=()=>{


let width=img.width;

let height=img.height;


const max=1600;



if(width>max){


height =
height*(max/width);

width=max;


}



canvas.width=width;

canvas.height=height;



const ctx =
canvas.getContext("2d");



ctx.drawImage(
img,
0,
0,
width,
height
);



canvas.toBlob(blob=>{


resolve(blob);


},
"image/jpeg",
0.85);



};



img.src=
URL.createObjectURL(file);



});

}







/* ==========================
   ENVOI PHOTO
========================== */


document
.getElementById("send")
.onclick=
async()=>{


if(!selectedFile){


alert(
"Choisis d'abord une photo 📸"
);


return;


}



const button =
document.getElementById("send");


const message =
document.getElementById("message");



button.textContent=
"Envoi... 🚀";



const compressed =
await compressImage(selectedFile);



/*
================================================

ICI ON CONNECTERA SUPABASE

Exemple :

await supabase.storage
.from("photos")
.upload(...)

================================================
*/


setTimeout(()=>{


button.textContent=
"Envoyé !";


launchConfetti();



showPage("success");



},1500);



};








/* ==========================
   CONFETTIS
========================== */


function launchConfetti(){



if(typeof confetti==="undefined")
return;



confetti({

particleCount:150,

spread:120,

origin:{
y:.6
}

});



}







/* ==========================
   GALERIE
========================== */


let galleryPhotos=[];



function refreshGallery(){


const grid =
document.getElementById("galleryGrid");


grid.innerHTML="";



galleryPhotos.forEach(photo=>{


const img =
document.createElement("img");


img.src=photo.url;


grid.appendChild(img);


});



}



refreshGallery();








/* ==========================
   CLASSEMENT
========================== */


const rankingData=[

{
name:"Titanic",
score:0
},

{
name:"Le radeau de la Méduse",
score:0
},

{
name:"La Joconde",
score:0
}


];



function updateRanking(){


const box =
document.getElementById("rankingContent");


box.innerHTML="";



rankingData
.sort((a,b)=>b.score-a.score)
.forEach((item,index)=>{


box.innerHTML += `

<div class="rank">

${index+1} 🏆

<strong>${item.name}</strong>

<span>
${item.score} photos
</span>


</div>

`;


});


}



updateRanking();







/* ==========================
   ADMIN RACCOURCI
========================== */


// ouvrir avec CTRL + SHIFT + A

document.addEventListener(
"keydown",
(e)=>{


if(
e.ctrlKey &&
e.shiftKey &&
e.key==="A"
){


document
.getElementById("admin")
.style.display="block";


}



});



document
.getElementById("closeAdmin")
.onclick=()=>{


document
.getElementById("admin")
.style.display="none";


};







/* ==========================
   INIT
========================== */


document
.getElementById("challengeTitle")
.textContent =
currentChallenge.title;



document
.getElementById("challengeText")
.textContent =
currentChallenge.description;



console.log(
"🎉 Application 50 ans chargée !"
);