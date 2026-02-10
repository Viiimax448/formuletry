// F1 2026 Calendar Data - Static Version
// Generated from API: http://localhost:4010/api/schedule

export const f1Calendar2026 = [
  {
    "name": "ARAMCO PRE-SEASON TESTING 1 2026",
    "countryName": "Bahrain",
    "start": "2026-02-11T00:00:00Z",
    "end": "2026-02-14T00:00:00Z",
    "sessions": [
      {"kind": "Practice 1", "start": "2026-02-11T00:00:00Z", "end": "2026-02-12T00:00:00Z"},
      {"kind": "Practice 2", "start": "2026-02-12T00:00:00Z", "end": "2026-02-13T00:00:00Z"},
      {"kind": "Practice 3", "start": "2026-02-13T00:00:00Z", "end": "2026-02-14T00:00:00Z"}
    ]
  },
  {
    "name": "QATAR AIRWAYS AUSTRALIAN GRAND PRIX 2026",
    "countryName": "Australia",
    "start": "2026-03-06T01:30:00Z",
    "end": "2026-03-08T06:00:00Z",
    "sessions": [
      {"kind": "Practice1", "start": "2026-03-06T01:30:00Z", "end": "2026-03-06T02:30:00Z"},
      {"kind": "Practice2", "start": "2026-03-06T05:00:00Z", "end": "2026-03-06T06:00:00Z"},
      {"kind": "Practice3", "start": "2026-03-07T01:30:00Z", "end": "2026-03-07T02:30:00Z"},
      {"kind": "Qualifying", "start": "2026-03-07T05:00:00Z", "end": "2026-03-07T06:00:00Z"},
      {"kind": "Race", "start": "2026-03-08T04:00:00Z", "end": "2026-03-08T06:00:00Z"}
    ]
  }
  // ... (resto de los eventos - puedes copiar del schedule_data.json)
];

// Utility functions
export const getCurrentEvent = () => {
  const now = new Date();
  return f1Calendar2026.find(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return now >= start && now <= end;
  });
};

export const getNextEvent = () => {
  const now = new Date();
  return f1Calendar2026.find(event => {
    const start = new Date(event.start);
    return start > now;
  });
};