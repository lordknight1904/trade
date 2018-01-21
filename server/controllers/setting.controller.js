import Setting from '../models/setting';

export function getSettings(req, res) {
  Setting.find().exec((err, settings) => {
    if (err) {
      res.json({ settings: [] });
    } else {
      res.json({ settings });
    }
  })
}
