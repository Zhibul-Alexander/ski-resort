const fs = require('fs');
const path = require('path');

const langs = ['en', 'ge', 'kk', 'zh', 'he'];

langs.forEach(lang => {
  try {
    const file = path.join('content', lang, 'site.json');
    const content = fs.readFileSync(file, 'utf8');
    let json = JSON.parse(content);
    
    // Remove resort object
    delete json.resort;
    
    // Remove resort-related fields from pageTitles
    if (json.pageTitles) {
      delete json.pageTitles.resortMap;
      delete json.pageTitles.resortPhotos;
      delete json.pageTitles.capacity;
      delete json.pageTitles.start;
      delete json.pageTitles.verticalDrop;
      delete json.pageTitles.length;
      delete json.pageTitles.liftsSubtitle;
      delete json.pageTitles.navSkiResort;
    }
    
    // Remove resort-related sections
    if (json.sections) {
      delete json.sections.resortMap;
      delete json.sections.resortLifts;
      delete json.sections.liveStream;
      delete json.sections.resortPhotos;
    }
    
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log(`Updated ${lang}`);
  } catch (e) {
    console.error(`Error with ${lang}:`, e.message);
  }
});

