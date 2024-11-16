export const TABLE_LIMITS = [
    10,50,100,150,200
];
export const SENTENCE_STATUS = {
    'unchanged': 10,
    'published': 30,
    'editing': 50,
    'waiting': 70,
    'refused': 90,
};

export const USER_PRIVILEGES = {
    'store user' : 1,
    'update user' : 2,
    'destroy user' : 3,
    'view user' : 4,
    'view users' : 5,


    'store relation' : 21,
    'update relation' : 22,
    'destroy relation' : 23,
    'view relation' : 24,
    'view relations' : 25,

    'store sentence' : 41,
    'update sentence' : 42,
    'destroy sentence' : 43,
    'view sentence' : 44,
    'view sentences' : 45,
    'publish sentence' : 46,
    'update sentence words' : 47,
}