export interface Area {
  slug: string
  name: string
  nameHi: string
  description?: string
}

export const AREAS: Area[] = [
  // Gorakhpur localities
  { slug: 'golghar', name: 'Golghar', nameHi: 'गोलघर' },
  { slug: 'shahpur', name: 'Shahpur', nameHi: 'शाहपुर' },
  // Eastern UP districts
  { slug: 'padrauna', name: 'Padrauna', nameHi: 'पडरौना' },
  { slug: 'deoria', name: 'Deoria', nameHi: 'देवरिया' },
  { slug: 'kushinagar', name: 'Kushinagar', nameHi: 'कुशीनगर' },
  { slug: 'maharajganj', name: 'Maharajganj', nameHi: 'महाराजगंज' },
  { slug: 'basti', name: 'Basti', nameHi: 'बस्ती' },
  { slug: 'siddharthnagar', name: 'Siddharthnagar', nameHi: 'सिद्धार्थनगर' },
  { slug: 'sant-kabir-nagar', name: 'Sant Kabir Nagar', nameHi: 'संत कबीर नगर' },
  { slug: 'azamgarh', name: 'Azamgarh', nameHi: 'आज़मगढ़' },
  { slug: 'mau', name: 'Mau', nameHi: 'मऊ' },
  { slug: 'ballia', name: 'Ballia', nameHi: 'बलिया' },
  { slug: 'jaunpur', name: 'Jaunpur', nameHi: 'जौनपुर' },
  { slug: 'gonda', name: 'Gonda', nameHi: 'गोंडा' },
  { slug: 'bahraich', name: 'Bahraich', nameHi: 'बहराइच' },
  { slug: 'sultanpur', name: 'Sultanpur', nameHi: 'सुल्तानपुर' },
  // Major cities
  { slug: 'varanasi', name: 'Varanasi', nameHi: 'वाराणसी' },
  { slug: 'lucknow', name: 'Lucknow', nameHi: 'लखनऊ' },
  { slug: 'prayagraj', name: 'Prayagraj', nameHi: 'प्रयागराज' },
  { slug: 'faizabad-ayodhya', name: 'Faizabad / Ayodhya', nameHi: 'फ़ैज़ाबाद / अयोध्या' },
  // Bihar & Jharkhand
  { slug: 'patna', name: 'Patna', nameHi: 'पटना', description: "Bihar's capital and largest insurance market in eastern India, with a rapidly growing professional class seeking modern financial planning." },
  { slug: 'gaya', name: 'Gaya', nameHi: 'गया', description: "A major pilgrimage city with a growing middle class increasingly seeking financial planning to secure their family's future." },
  { slug: 'muzaffarpur', name: 'Muzaffarpur', nameHi: 'मुज़फ़्फ़रपुर', description: "North Bihar's commercial hub, known for its entrepreneurial spirit and agricultural wealth, with strong demand for savings-linked insurance." },
  { slug: 'bhagalpur', name: 'Bhagalpur', nameHi: 'भागलपुर', description: "The Silk City of Bihar, an education and trade centre with diverse insurance needs spanning families, businesses, and the academic community." },
  { slug: 'darbhanga', name: 'Darbhanga', nameHi: 'दरभंगा', description: "Cultural capital of the Mithila region, home to government employees and teachers who prioritise secure, long-term insurance plans." },
  { slug: 'purnia', name: 'Purnia', nameHi: 'पूर्णिया', description: "A key hub in the Koshi region of Bihar with strong agricultural and business communities building financial security for the next generation." },
  { slug: 'siwan', name: 'Siwan', nameHi: 'सीवान', description: "Close to the UP-Bihar border near Gorakhpur, with many cross-border families and commuters seeking unified insurance coverage." },
  { slug: 'chapra', name: 'Chapra', nameHi: 'छपरा', description: "Headquarters of Saran district, a growing centre for rural insurance awareness where Poddar Wealth extends financial protection to families." },
  { slug: 'ranchi', name: 'Ranchi', nameHi: 'रांची', description: "Jharkhand's capital city with a rapidly urbanising population and expanding IT sector, creating fresh demand for comprehensive life and health cover." },
  { slug: 'dhanbad', name: 'Dhanbad', nameHi: 'धनबाद', description: "The Coal Capital of India with high-income mining and industrial demographics — families here prioritise accident cover, critical illness, and retirement plans." },
]
