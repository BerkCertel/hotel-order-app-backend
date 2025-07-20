import QRCode from "qrcode";

const generateQRImage = async (text) => {
  try {
    const base64Image = await QRCode.toDataURL(text);
    return base64Image;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default generateQRImage;
