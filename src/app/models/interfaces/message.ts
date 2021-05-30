import { Priority } from './../enum/priority.enum';
import { Recipient } from './recipient';
import { Sender } from './sender';
import { Status } from './../enum/status.enum';
import { Type } from './../enum/type.enum';

export interface Message {
    sender: Sender,
    recipient: Recipient,
    text: String,
    type: Type,
    priority: Priority,
    state: String,
    status: Status,
    id: String,
}
