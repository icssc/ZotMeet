export function isDatePast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); //set to start of day

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0); 

    return compareDate < today;
} 