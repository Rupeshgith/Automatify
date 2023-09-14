const selectTag= document.querySelectorAll("select");
const fromText= document.querySelector(".from-text");
const toText= document.querySelector(".to-text");
const translateBtn= document.querySelector(".translate");
const icons= document.querySelectorAll(".row i");

/////////// made select tag of language
selectTag.forEach((tag,id)=>{
    for(const country_code in countries){
       // console.log(countries[country_code]);

        let selected;
        if(id==0 && country_code== "en-GB"){
            selected= "selected";
        }else if(id==1 && country_code== "hi-IN"){
            selected= "selected";
        }

        let option= `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend",option); /// adding option tag inside select tag
    }
})

////////////////////////////// worked on translate text

translateBtn.addEventListener("click",async()=>{
    let conti= "";
    let text= fromText.value;
    console.log(text.length);
    translateFrom= selectTag[0].value; //getting fromselect tag value
    translateTo= selectTag[1].value;   //getting toselect tag value

    let i=0, len= text.length
    while(len>450){
        let temp= text.slice(i*450,(i+1)*450);
        let apiUrl= `https://api.mymemory.translated.net/get?q=${temp}&langpair=${translateFrom}|${translateTo}`
        let res= await fetch(apiUrl);
        let data= await res.json();
        conti += data.responseData.translatedText;
        len= len-450;
        i++;
    }
    let temp1= text.slice(i*450);
   ////// api can fetch 5000 characters per time
   let apiUrl= `https://api.mymemory.translated.net/get?q=${temp1}&langpair=${translateFrom}|${translateTo}`
   let res= await fetch(apiUrl);
   let data= await res.json();
   toText.value= conti+ data.responseData.translatedText;
   
})

/*translateBtn.addEventListener("click",()=>{
    let text= fromText.value;
    console.log(text.length);
    translateFrom= selectTag[0].value; //getting fromselect tag value
    translateTo= selectTag[1].value;   //getting toselect tag value
   // console.log(text,translateFrom,translateTo);

   ////// api can fetch 5000 characters per time
   let apiUrl= `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then((data)=>{
        toText.value= data.responseData.translatedText;
        console.log(data);
    })
})*/

/// worked on speech and copytext
icons.forEach((icon)=>{
    icon.addEventListener("click",({target})=>{
        if(target.classList.contains("fa-copy")){
            if(target.id == "from"){
                navigator.clipboard.writeText(fromText.value);
            }else{
                navigator.clipboard.writeText(toText.value);
            }
        }else{
            let utterance;
            if(target.id == "from"){
                console.log(fromText.value)
                utterance= new SpeechSynthesisUtterance(fromText.value);
                utterance.lang= selectTag[0].value; /// setting utterance language for formselect tag value 
            }
            else{
                console.log(toText.value)
                utterance= new SpeechSynthesisUtterance(toText.value);
                utterance.lang= selectTag[1].value; /// setting utterance language for toselect tag value 
            }
            speechSynthesis.speak(utterance); // speak the selected uttence language
        }
    })
})

