/**
 * Frågor och svar om planeringssimulatorn.
 * Redigera den här listan för att uppdatera FAQ-rutan i appen.
 */
export const FAQ_ITEMS = [
    {
        question: 'Vad är det här för simulator?',
        answer:
            'En förenklad planeringssimulator för Sydöstra Uppsala. Du kan placera olika stadstyper på rutnätet, se hur många bostäder planen ger och jämföra stationsnära bostäder med befintliga stationsområden.'
    },
    {
        question: 'Vad är kartmodell?',
        answer:
            'Kartmodell är menyn uppe till höger där du väljer hur rutnätet ritas. ”Platta färger” visar enkla, rena färgrutor. ”Top down” är standardläget med en mer kartliknande vy. ”Tecknat” ger en illustrerad, serietidningsinspirerad stil som matchar introduktionen.'
    },
    {
        question: 'Vad betyder Grönska (3-30-300)?',
        answer:
            'Indikatorn följer 300-metersregeln: ingen bostad ska ligga längre än 300 meter från park eller skog. Simulatorn varnar med gult om någon bostad har mer än 200 meter till närmaste grönområde.'
    },
    {
        question: 'Vad är Uppsalapaketet?',
        answer:
            'Det syftar på Fyrspårsavtalet och det stora bostadsbyggandet som Uppsala kommun planerar i området. Indikatorn blir grön när du har minst 21 500 nya bostäder i spelområdet.'
    },
    {
        question: 'Vad händer om Uppsalapaketet är rött?',
        answer:
            'Då blir det kanske ingen spårvagn till Gottsunda. (Men det beror också på hur mycket man bygger ut Gottsunda, vilket inte är med i den här simulatorn.) Fyrspåret används av alla som har nytta av bättre resor från Uppsala station, och fler bostäder kommer att byggas i kommunen.'
    },
    {
        question: 'Hur stor blir Bergsbrunna station?',
        answer:
            '”Stationsnära bostäder” visar hur många bostäder som du planerat inom 5 minuters gångavstånd (400 m) till stationen och ger exempel på stationer med liknande antal bostäder i närområdet. Notera att Bergsbrunna bara kommer att ha bostäder på västra sidan av spåret medan många av exemplen har bostäder på båda sidor.'
    },
    {
        question: 'Sparas min plan eller mina uppgifter någonstans?',
        answer:
            'Nej, inte på någon server. Allt körs lokalt i din webbläsare. Om du delar en länk med Klar & Dela! ligger din plan kodad i webbadressen — men ingen data skickas till oss eller lagras någon annanstans.'
    },
    {
        question: 'Sätter sidan några cookies?',
        answer:
            'Nej. Simulatorn sätter inga cookies och har ingen spårning eller analys. Den sparar bara ditt val av kartmodell lokalt i webbläsaren (localStorage). Typsnittet laddas från Google Fonts — det är en extern tjänst som i vissa fall kan sätta egna cookies, men det kommer inte från simulatorn själv.'
    },
    {
        question: 'Hur fungerar Återställ?',
        answer:
            'Alla byggbara rutor återgår till ursprunglig skog och park. Boulevard, Stordammen, befintlig Sävja och andra fasta delar ligger kvar.'
    },
    {
        question: 'Är inte den här simulatorn ganska tråkig?',
        answer:
            'Ja, SimCity är roligare. Poängen med den här sidan är bara att ge folk en chans att se vad 21 500 nya bostäder i Sydöstra Uppsala faktiskt skulle innebära.'
    },
    {
        question: 'Vad gör Klar & Dela!?',
        answer:
            'Skapar en länk till din plan. En vän kan öppna länken och se exakt vad du byggt, prova egna förslag och dela en ny länk tillbaka. På Facebook visas samma förhandsvisning för alla länkar — skriv gärna en egen kommentar om din plan när du delar.'
    }
];
