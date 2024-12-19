export interface User {
    firstName: string;
    lastName: string;
    email: string;
    uid: string;
    isFollowed?: boolean;
}

export interface FirestoreUser extends User {
    following?: string[]; // This will store UIDs instead of emails
}
