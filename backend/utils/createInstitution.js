import { Institution } from '../models/index.js';

const name = 'CC Pro Organization';
const code = 'CCPRO';
const address = 'CC Pro';
const website = 'https://ccpro.org';

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