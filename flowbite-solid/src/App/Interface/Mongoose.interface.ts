export interface IMongoosePagination {
    page: number,
    linkPerPage: number,
    limit: number,
    sort?: number,
}

export interface IPaginated<Interface> {
    pagination: {
        pages: number[]
        next: number,
        current: number,
        previous: number,
        total: number,
        totalSoFar: number,
        lastPage: number,
        firstPage: number,
        end: boolean
    },
    data: Interface[]
}