export interface Area {
  slug: string
  name: string
  nameHi: string
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
]
