import careerPublicJson from "./generated/career-public.json";
import searchIndexJson from "./generated/search-index.json";

import type { CareerPublicData, SearchIndex } from "./public-contract";

export const careerData = careerPublicJson as CareerPublicData;
export const careerSearchIndex = searchIndexJson as SearchIndex;
