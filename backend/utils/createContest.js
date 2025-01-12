import { Contests } from "../models/index.js";



function parseDate(dateStr,timeStr){
    const [day, month, year] = dateStr.split("-").map(Number);
    
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if(period === "PM" && hours !== 12){
        hours += 12;
    } else if(period === "AM" && hours === 12){
        hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes);
}

const name2 = 'CodeContest Beginner Round (BEGIN#1)';
const description2 = 'CodeContest Beginner Round (BEGIN#1) is a round for beginners. This round will have 2 problems and a duration of 1 hour. The allowed languages are Python and JavaScript. The contest will start on 20th January 2025 at 10:00 AM and end on 20th January 2025 at 11:00 AM.';
const allowedLanguages2 = ['python', 'javascript'];
const startDate2 = parseDate('20-01-2025', '10:00 AM');
const endDate2 = parseDate('20-01-2025', '11:00 AM');

const institutionId = 1;

const createAnotherContest = async () => {
    try {
        await Contests.create({
            name: name2,
            description: description2,
            allowedLanguages: allowedLanguages2,
            startDate: startDate2,
            endDate: endDate2,
            institutionId,
        });
        console.log('Another contest created successfully');
    } catch (error) {
        console.error('Error creating another contest:', error.message);
    }
};

createAnotherContest();




const createContest = async () => {
    try {
        await Contests.create({
            name,
            description,
            allowedLanguages,
            startDate,
            endDate,
            institutionId,
        });
        console.log('Contest created successfully');
    } catch (error) {
        console.error('Error creating contest:', error.message);
    }
};

createContest();

