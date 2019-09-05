# emoji-essential

An emoji dictionary directly from https://unicode.org/ updated through automation on each unicode release.

The dictionary contains groups as main key, sub group per each main key, and finally an emoji > short name key/value pair.

Suitable for most common emoji related operations.

```js
import emojiEssential from 'emoji-essential';
// or
const emojiEssential = require('emoji-essential');

console.log(emojiEssential.Activities.event[`🎉`]);
"party popper"
```


## Handy variants

This section contains few ways to transform current module for you needs.

The idea is to use one base that contains all the latest unicode code, and create different versions of the same base with the smallest amount of code.


#### :emoji_name: to emoji and vice-versa

Useful for markdown cases or forums.

```js
const ee = require('emoji-essential');
const name2emoji = {};
Object.keys(ee).forEach(group => {
  Object.keys(ee[group]).forEach(sub => {
    Object.keys(ee[group][sub]).forEach(emoji => {
      const key = `:${ee[group][sub][emoji].replace(/[ :]+/g, '_')}:`;
      name2emoji[key] = emoji;
      name2emoji[emoji] = key;
    });
  });
});

name2emoji[':party_popper:']; // 🎉
name2emoji['🎉']; // :party_popper:
```

#### grouped by main type

Useful for emoji UI pickers.

```js
const ee = require('emoji-essential');
const ee = require('.');
const emoji = {};
Object.keys(ee).forEach(group => {
  emoji[group] = {
    glyph: [],
    description: []
  };
  Object.keys(ee[group]).forEach(sub => {
    Object.keys(ee[group][sub]).forEach(key => {
      emoji[group].glyph.push(key);
      emoji[group].description.push(ee[group][sub][key]);
    });
  });
});
```

