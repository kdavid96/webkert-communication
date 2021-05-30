import { Sender } from '../interfaces/sender';

export interface ContactMessage {
    sender: Sender,
    recipient: String,
    text: String,
    subject: String,
    id: String,
    read: String,
}
