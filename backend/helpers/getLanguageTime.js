const getLanguageTime = (language, time) => {
    const timeMultipliers = {
        50: 1,  // C
        54: 1,  // C++
        62: 2,  // Python
        71: 2   // Java
    };

    return time * (timeMultipliers[language] || 1);
};

export default getLanguageTime;
