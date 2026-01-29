export const parseDate = (value) => {
  if (!value || typeof value !== "string") return null;
  // "2003"
  if (/^\d{4}$/.test(value)) {
    return new Date(`${value}-01-01`);
  }
  // "dec-2025"
  if (/^[a-zA-Z]{3}-\d{4}$/.test(value)) {
    return new Date(`01-${value}`);
  }
  // "2025-12-11"
  const date = new Date(value);
  return isNaN(date) ? null : date;
};
export const dateFieldMap = {
  patents: "year_of_published/granted",
  journal: "year_of_publication",
  book: "year_of_publication",
  book_chapter: "year_of_publication",
  conference_paper: "date_of_publication",
  keynote: "date",
  talk: "date",
  awards_and_recognitions: "year",
  research: "year_of_sanction",
  consultancy: "year_of_sanction",
  phd_awarded: "year_of_awarding",
  ieee: "year_joined",
  csi: "year_joined",
  chair: "date",
  lecture: "date",
  resource_person: "date",
  mooc_content: "month_year",
  e_content: "month_year",
  innovative_pedagogy: "year_of_development",
  acm: "year_joined",
  ie: "year_joined",
  iete: "year_joined",
  other_bodies: "year_joined",
  book_book_chapter: "month_year_of_publication",
  phd_ongoing: "year_of_joining",
  mtech: "year_of_awarding",
  //start and end dates 
  foreign_visits: {start: "start_date",end: "end_date"},
  fdp: {start: "start_date",end: "end_date"},
  sttp:{start: "start_date",end: "end_date"},
  conference:{start: "start_date",end: "end_date"},
  workshop: {start: "start_date",end: "end_date"},
  seminar: {start: "start_date",end: "end_date"},
  webinar:{start: "start_date",end: "end_date"},
  rc:{start: "start_date",end: "end_date"},
  oc:{start: "start_date",end: "end_date"}, 
};

export const filterCredentialsByDate = (credentials, from, to) => {
  try {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);
  const result = {};
  console.log(credentials);
  
  for (const field in credentials) {
    const items = credentials[field];
    const dateKey = dateFieldMap[field];
    if (!dateKey || !Array.isArray(items)) continue;
    if (field === "foreign_visits") {
      console.log("it runned !!!!");
      const filtered = items.filter(item => {
        const start = parseDate(item[dateKey.start]);
        const end = parseDate(item[dateKey.end]);
        return start && end && start <= toDate && end >= fromDate;
      });
      if (filtered.length) result[field] = filtered;
      continue;
    }
    const filtered = items.filter(item => {
      const itemDate = parseDate(item[dateKey]);
      return itemDate && itemDate >= fromDate && itemDate <= toDate;
    });
    if (filtered.length) result[field] = filtered;
  }
  console.log("date filtered was :",result);
  
  return result
  } catch (error) {
    console.log(error);
  }
};

export const filterSubfields = (credentials, subfields) => {
  const result = {};
  for (const field in credentials) {
    const items = credentials[field];    
    if (!subfields[field]) {
      result[field] = items;
      continue;
    }
    result[field] = items.map(item => {
      const filtered = {};
      for (const key of subfields[field]) {
        if (item[key] !== undefined) {
          filtered[key] = item[key];
        }
      }
      return filtered;
    });
  }
  return result;
};
