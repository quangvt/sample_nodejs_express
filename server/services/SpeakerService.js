const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

class SpeakerService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getNames() {
    const data =  await this.getData();
    return data.map((speaker) => {
      return {name: speaker.name, shortname: speaker.shortname};
    });
  }

  async getListShort() {
    const data = await this.getData();
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title }
    })
  }

  async getList() {
    const data = await this.getData();
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title, summary: speaker.summary }
    })
  }

  async getAllArtWork() {
    const data = await this.getData();
    const artwork = data.reduce((acc, elm) => {
      if(elm.artwork) {
        acc = [...acc, ...elm.artwork];
      }
      return acc;
    }, []);
    return artwork;
  }

  async getSpeaker(shortname) {
    const data = await this.getData();
    // return data.filter(speaker => speaker.shortname === sname);
    const speaker = data.find((speaker) => {
      return speaker.shortname === shortname;
    });
    if(!speaker) return null;
    return {
      title: speaker.title,
      name: speaker.name,
      shortname: speaker.shortname,
      description: speaker.description,
    }
  }

  async getArtworkForSpeaker(shortname) {
    const data = await this.getData();
    const speaker = data.find((speaker) => {
      return speaker.shortname === shortname;
    });
    if(!speaker && !speaker.artwork) return null;
    return speaker.artwork;
  }

  // async getArtworkByShortname(sname) {
  //   const data = await this.getData();
  //   const speaker = data.filter(speaker => speaker.shortname === sname);
  //   return (speaker && speaker.length) ? speaker[0].artwork : [];
  // }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if(!data) return [];
    return JSON.parse(data).speakers;
  }


}

module.exports = SpeakerService;