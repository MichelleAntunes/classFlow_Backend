class MyImageData {
  data: Buffer;
  mimeType: "image/png" | "image/jpeg";

  constructor(data: Buffer, mimeType: "image/png" | "image/jpeg") {
    this.data = data;
    this.mimeType = mimeType;
  }
}
