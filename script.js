/* =====================================================
   LES 50 ANS DE CHRISTOPHE (dit "Parrain")
   Application photo collaborative
===================================================== */


/* ==========================
   VARIABLES
========================== */


const pages = document.querySelectorAll(".page");


let currentChallenge = {

    title: "Le radeau de la Méduse",

    description:
    "Reproduisez une œuvre célèbre avec les invités.",

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



    const target =
    document.getElementById(id);



    if(target)
    target.classList.add("active");


}




document
.querySelectorAll(".navigation button")
.forEach(button=>{


    button.addEventListener("click",()=>{


        showPage(button.dataset.page);


    });


});





const start =
document.getElementById("start");


if(start){

start.onclick=()=>{

    showPage("challenge");

};

}






document
.querySelectorAll(".back")
.forEach(btn=>{


    btn.onclick=()=>{


        showPage("home");


    };


});





const photoButton =
document.getElementById("photo");


if(photoButton){


photoButton.onclick=()=>{


    showPage("upload");


};


}






const again =
document.getElementById("again");


if(again){


again.onclick=()=>{


    showPage("challenge");


};


}







/* ==========================
   CHOIX DES DEFIS
========================== */


document
.querySelectorAll(".challenge-card")
.forEach(card=>{


    card.addEventListener("click",()=>{


        document
        .querySelectorAll(".challenge-card")
        .forEach(c=>{

            c.classList.remove("selected");

        });



        card.classList.add("selected");



        currentChallenge = {


            id:
            card.dataset.id,


            title:
            card.dataset.title,


            description:
            card.dataset.description


        };





        const title =
        document.getElementById("challengeTitle");


        const text =
        document.getElementById("challengeText");



        if(title)
        title.textContent =
        currentChallenge.title;



        if(text)
        text.textContent =
        currentChallenge.description;



    });


});








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



        const title =
        document.getElementById("challengeTitle");



        if(title)
        title.textContent =
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





if(input){


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



        preview.src =
        e.target.result;



        preview.style.display =
        "block";



        if(empty)
        empty.style.display =
        "none";


    };



    reader.readAsDataURL(file);



});


}









/* ==========================
   COMPRESSION IMAGE
========================== */



async function compressImage(file){


return new Promise(resolve=>{


const img =
new Image();



const canvas =
document.createElement("canvas");



img.onload=()=>{


let width =
img.width;


let height =
img.height;



const max =
1600;



if(width > max){


height =
height * (max / width);


width =
max;


}




canvas.width =
width;


canvas.height =
height;





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

0.85

);



};




img.src =
URL.createObjectURL(file);



});


}/* ==========================
   ENVOI PHOTO
========================== */


const sendButton =
document.getElementById("send");



if(sendButton){


sendButton.onclick =
async()=>{


if(!selectedFile){


alert(
"Choisis d'abord une photo 📸"
);


return;


}



sendButton.textContent =
"Envoi... 🚀";



try{


const filename =

Date.now()

+

"-"

+

selectedFile.name

.trim()

.replace(/\s+/g,"-")

.replace(/[^a-zA-Z0-9.-]/g,"");





const compressed =

await compressImage(selectedFile);






// UPLOAD STORAGE


const upload =

await window.supabaseClient

.storage

.from("photos")

.upload(

filename,

compressed,

{

contentType:"image/jpeg"

}

);





if(upload.error)

throw upload.error;






// URL PUBLIQUE


const publicUrl =

window.supabaseClient

.storage

.from("photos")

.getPublicUrl(filename)

.data

.publicUrl;







// INSERT DATABASE


const insert =

await window.supabaseClient

.from("photos")

.insert({



url:

publicUrl,



filename:

filename,



storage_path:

filename,



challenge:

currentChallenge.title,



author:

document.getElementById("name")?.value

||

"Anonyme"



});






if(insert.error)

throw insert.error;








launchConfetti();





showPage("success");



sendButton.textContent =
"Envoyé 🎉";



await refreshGallery();





}

catch(error){


console.error(error);


alert(
"Erreur pendant l'envoi 😕"
);



sendButton.textContent =
"Envoyer ✨";


}



};


}









/* ==========================
   CONFETTIS
========================== */


function launchConfetti(){



if(typeof confetti !== "function")
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



async function refreshGallery(){



const grid =
document.getElementById("galleryGrid");



if(!grid)
return;





const {

data,

error

} =

await window.supabaseClient

.from("photos")

.select("*")

.order(

"created_at",

{

ascending:false

}

);







if(error){


console.error(error);


return;


}






grid.innerHTML="";






if(!data || data.length===0){


grid.innerHTML=`

<div class="empty-gallery">

Aucune photo pour le moment 📸

</div>

`;

return;


}







data.forEach(photo=>{



grid.innerHTML += `


<div class="photo-card">


<img src="${photo.url}">



<div class="photo-info">


<h3>

🎯 ${photo.challenge || "Défi"}

</h3>



<p>

👤 ${photo.author || "Anonyme"}

</p>



</div>


</div>



`;



});





}










/* ==========================
   GALERIE TEMPS REEL
========================== */


if(window.supabaseClient){


window.supabaseClient


.channel("photos-live")


.on(

"postgres_changes",

{


event:"INSERT",


schema:"public",


table:"photos"


},


()=>{


refreshGallery();


}


)


.subscribe();


}








/* ==========================
   ADMIN
========================== */



document.addEventListener(

"keydown",

(e)=>{


if(

e.ctrlKey &&

e.shiftKey &&

e.key==="A"

){



const admin =
document.getElementById("admin");



if(admin)

admin.style.display="block";


}



});





const closeAdmin =
document.getElementById("closeAdmin");



if(closeAdmin){


closeAdmin.onclick=()=>{


document

.getElementById("admin")

.style.display="none";


};


}









/* ==========================
   INITIALISATION
========================== */



const title =
document.getElementById("challengeTitle");



const text =
document.getElementById("challengeText");



if(title)

title.textContent =
currentChallenge.title;



if(text)

text.textContent =
currentChallenge.description;





refreshGallery();





console.log(
"🎉 Application 50 ans chargée !"
);
