export type MessageType = "default" | "success" | "error";

export type MessageProps = {
    type: MessageType;
    message: string;
};