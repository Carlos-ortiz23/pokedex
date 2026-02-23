export interface HttpAdapter {
    get<T>(url: string ): Promise<T>; //Patron adaptador
}