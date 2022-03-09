var weaponTalentParser = {
  'Armor Piercing': () => {},
  'Full-Auto': () => {},
  'Slow recharge: Can only be fired every other round': () => {},
  'Power Supply 4': () => {},
  'Armor Doubled': () => {},
  'Burst: Able to use this weapon as though you had the Rapid Fire Talent':
    () => {},
  'No Armour doubled penalty': () => {},
  'Dual Shot: Must reload after every 2 shots': () => {},
  'Quad Shot: Must reload after every 4 shots': () => {},
  'Single shot': () => {},
  'Grenade Launcher': () => {},
  'Damage: 3 Short': () => {},
  '2 Medium or further': () => {},
  'Blast 9 (Fires: Mark 6 High Explosive Smart Bounce': () => {},
  'Blast 9': () => {},
  'Fire Intensity 9': () => {},
  'Full Auto': () => {},
  'Fire Intensity 8': () => {},
  'Power Supply 5': () => {},
};

var defaultOptions = {
  rangedCombat: 1,
  agility: 3,
  armour: 5,
  aspects: [
    { default: false, value: 'Total Damage', label: 'Total Damage' },
    { default: true, value: 'Damage', label: 'Damage' },
    { default: true, value: 'Bonus Damage', label: 'Bonus Damage' },
    {
      default: false,
      value: 'Armour Damage Reduction',
      label: 'Armour Damage Reduction',
    },
  ],
};

const aspectData = {
  Damage: {
    plural: 'DPR',
  },
  'Bonus Damage': {
    plural: 'Pushed DPR',
  },
};

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.average = function () {
  return this.reduce((p, c) => p + c, 0) / this.length;
};

Array.prototype.aspectAverage = function (aspect) {
  return this.map((s) => s[aspect]).average();
};
const d6 = [1, 2, 3, 4, 5, 6];

const rollDice = (n = 1) => {
  return Array.from({ length: n }).map(() => d6.sample());
};

const runSingleTest = ({ weapon, testNo, options = defaultOptions }) => {
  // make attack
  var {
    rangedCombat,
    agility,
    // targetSize,
    // range
    armour,
  } = options;

  var { DAMAGE, BONUS, RANGE } = weapon;

  var rawRoll = rollDice(rangedCombat + agility + BONUS);
  var successes = rawRoll.filter((s) => s == 6);
  var failures = rawRoll.filter((s) => s == 1);

  var Damage = successes.length < 1 ? 0 : DAMAGE;
  var pushedDamage = successes.length > 1 ? successes.length - 1 : 0;

  var armourSaves = rollDice(armour).filter((s) => s == 6);

  // var damageReduction = successes.length > 1 ? successes.length - 1 : 0;
  var damageReduction = armourSaves.length > 1 ? armourSaves.length : 0;
  damageReduction = -damageReduction;
  // Damage -= damageReduction;
  var result = {
    'Bonus Damage': pushedDamage,
    'Armour Damage Reduction': damageReduction,
    Damage,
    'Total Damage': Damage + pushedDamage + damageReduction,
    rawRoll,
    successes,
    failures,
  };
  return result;
};

const runManyTests = ({ num, weapon, options }) => {
  console.log('running', num, 'tests on', weapon.NAME);
  return Array.from({ length: num }).map((n, i) =>
    runSingleTest({ weapon, options, testNo: i })
  );
};

const runTestsOnWeapons = ({ weapons, num, options }) => {
  var o = [];

  weapons.forEach((weapon, i) =>
    o.push(runManyTests({ num, weapon, options }))
  );
  return o;
};

export {
  defaultOptions,
  aspectData,
  runSingleTest,
  runManyTests,
  runTestsOnWeapons,
};
