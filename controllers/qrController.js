// import connectDB from "@/utils/db";
// import QrLocation from "@/models/QrLocation";
// import { v4 as uuidv4 } from "uuid";
// import generateQRImage from "../middlewares/qrCodeMiddleware";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { location, name } = req.body;

//   if (!location || !name) {
//     return res.status(400).json({ message: "Location and name are required" });
//   }

//   const existingQr = await QrLocation.findOne({ location, name });

//   if (existingQr) {
//     return res.status(400).json({ message: "QR code already exists" });
//   }

//   if (typeof location !== "string" || typeof name !== "string") {
//     return res
//       .status(400)
//       .json({ message: "Location and name must be strings" });
//   }

//   // Generate a unique QR ID and URL

//   const qrId = uuidv4(); // benzersiz QR ID
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   const qrLink = `${baseUrl}/tr/qr/${qrId}`;

//   const qrImage = await generateQRImage(qrLink);

//   await connectDB();
//   const newQr = await QrLocation.create({ location, name, qrId, qrImage });

//   res.status(200).json({ qrImage, qrId, location, name });
// }
