
export interface Effect {
  id: string;
  name: string;
  prompt: string;
}

export interface OriginalImage {
  dataUrl: string;
  mimeType: string;
  name: string;
}
