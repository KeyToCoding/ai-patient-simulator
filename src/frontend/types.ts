export interface Message {
  id: string;
  sender: "doctor" | "patient";
  text: string;
  timestamp: Date;
}

export interface WebVoice {
  name: string;
  lang: string;
}
