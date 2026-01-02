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
  patents: "year_of_published_granted",
  journal: "year_of_publication",
  book: "year_of_publication",
  book_chapter: "year_of_publication",
  conference: "date_of_publication",
  seminar: "year",
  workshop: "year",
  fdp: "year",
  webinar: "year",
  oc: "year",
  keynote: "date",
  talk: "date",
  award_title: "year",
  research: "year_of_sanction",
  consultancy: "year_of_sanction",
  phd_awarded: "year_of_awarding",
  ieee: "year_joined",
  csi: "year_joined",
  foreign_visits: {
    start: "start_date",
    end: "end_date"
  }
};


// utils/credentialFilter.js
export const filterCredentialsByDate = (credentials, from, to) => {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);
  const result = {};

  for (const field in credentials) {
    const items = credentials[field];
    const dateKey = dateFieldMap[field];

    if (!dateKey || !Array.isArray(items)) continue;

    // foreign_visits (range overlap)
    if (field === "foreign_visits") {
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
  return result;
};

export const filterSubfields = (credentials, subfields) => {
  const result = {};
  const normalizedSubFields=Object.fromEntries(Object.entries(subfields).map(([key,value])=>([key,value.map((name)=>(name.toLowerCase().replace(/[^\w]/g,"_")))]))) 
  console.log(credentials);
  console.log(normalizedSubFields);

  for (const field in credentials) {
    const items = credentials[field];
    if (!items?.length) continue;
    if (!normalizedSubFields[field]) {
      result[field] = items;
      continue;
    }
    result[field] = items.map(item => {
      const filtered = {};
      for (const key of normalizedSubFields[field]) {
        if (item[key] !== undefined) {
          filtered[key] = item[key];
        }
      }
      console.log(filtered);
      return filtered;
    });
  }

  return result;
};
