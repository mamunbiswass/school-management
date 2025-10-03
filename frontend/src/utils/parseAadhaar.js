export default function parseAadhaarXML(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const data = xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0];

    return {
      uid: data?.getAttribute("uid") || "",
      name: data?.getAttribute("name") || "",
      dob: data?.getAttribute("dob") || "",
      yob: data?.getAttribute("yob") || "",
      gender: data?.getAttribute("gender") || "",
      gname: data?.getAttribute("gname") || "",
      co: data?.getAttribute("co") || "",
      loc: data?.getAttribute("loc") || "",
      vtc: data?.getAttribute("vtc") || "",
      dist: data?.getAttribute("dist") || "",
      subdist: data?.getAttribute("subdist") || "",
      state: data?.getAttribute("state") || "",
      pc: data?.getAttribute("pc") || "",
    };
  } catch (e) {
    console.error("❌ Invalid Aadhaar QR XML:", e);
    return {};
  }
}
