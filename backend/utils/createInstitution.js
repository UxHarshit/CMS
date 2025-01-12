import { Institution } from '../models/index.js';

const name = 'Lloyd Institute of Engineering and Technology';
const code = 'LIET';
const address = 'Knowledge Park III, Greater Noida, Uttar Pradesh, India';
const website = 'https://www.liet.in';

const createInstitution = async () => {
    try {
        const institution = await Institution.create({
            name,
            code,
            address,
            website,
        });
        console.log('Institution created successfully:', institution);
    } catch (error) {
        console.error('Error creating institution:', error);
    }
};

createInstitution();