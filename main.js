console.log("davs - her kører vi på openAI");


//grunddele af koden er fra Benjamin
const API_KEY = prompt("Write your API-key here");

//Skriver en ventebesked på siden
//henter den globalt - og sætter en besked ind senere (i getSuggestion som kaldes når man trykker på knappen)
const waitingMessage = document.querySelector("#waiting-message");


function getSuggestion() {
    //henter inputfelter fra html
    const customMessage = document.querySelector("#custom-message");
    const customName = document.querySelector("#custom-name");
    const customGender = document.querySelector("#recipient-gender");
    const generateMessageButton = document.querySelector("#generate-message");

    //sætter beskeden ind i AImessageElement
    waitingMessage.innerText = "Our AI is cooking💬\n- wait for your personalized birthday message!";


    //skriver mit promt her + sætter brugerens input (vens navn + custom message) ind
    const userContent = `Write a birthday greeting-message to a friend. Important: start the message with a greeting Hi to ${customName.value}. The gender of ${customName.value} is ${customGender.value}.
        The message will be send with sms. Important: the message must be 2-5 sentences. Make sure the message complements the friend and tell them how much they mean to the user. 
        It should also be funny. Use emojies like sparkles:✨, <3  confetti: 🎉 and birthdaycake:🎂 use (U+1F382). Important! Include this personal note from the user: 
        ${customMessage.value}`



    fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "user",
                    content: userContent
                }
            ],
            max_tokens: 1000,
            stream: false
        }),
    })
        .then(response => {
            if (!response.ok) {
                console.log(111);
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(suggestionData => {
            //den jer logger hele molevitten ud
            console.log(suggestionData);


            //svaret får lige et navn
            const AImessage = suggestionData.choices[0].message.content;
            console.log(AImessage);

            //kalder funktionen der skriver beskeden på siden
            writeSuggestion(AImessage);


        })
        .catch(error => console.error(error));
}

document.querySelector("#generate-message").addEventListener("click", getSuggestion);



//funktion der skriver selve beskeden
function writeSuggestion(input) {
    //Skriver svar på siden i div'en
    const responseElement = document.querySelector("#response");
    //laver et html-element der skal indeholde svaret
    const AImessageElement = document.createElement("p");
    //giver den et id - fra https://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript
    AImessageElement.id= "responseMessage";

    //sætter beskeden ind i AImessageElement
    AImessageElement.innerText = input;
    //fjerner tidligere svar
    responseElement.innerText = "";
    //sætter beskeden ind i div'en
    responseElement.appendChild(AImessageElement);


    //tømmer vente-beskeden igen
    waitingMessage.innerText = "";
}
