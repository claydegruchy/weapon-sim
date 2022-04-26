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

var weaponTalentParser = {
  "Armor Piercing": ({ weapon, options, round, results }) => {
    options.armour = Math.ceil(options.armour / 2);
  },
  "Full-Auto": ({ weapon, options, round, results }) => {
    if(options['Use full auto']) weapon.BONUS +=2
  },
  "Slow recharge: Can only be fired every other round": ({
    weapon,
    options,
    round,
  }) => {
    if (round % 2 === 0) {
      weapon.BONUS = 0;
      weapon.DAMAGE = 0;
    }
  },
  "Power Supply 4": ({ weapon, options, round, results }) => {},
  "Armor Doubled": ({ weapon, options, round, results }) => {
    options.armour = options.armour * 2;
  },
  "Burst: Able to use this weapon as though you had the Rapid Fire Talent": ({
    weapon,
    options,
    round,
  }) => {},
  "No Armour doubled penalty": ({ weapon, options, round, results }) => {},
  "Dual Shot: Must reload after every 2 shots": ({
    weapon,
    options,
    round,
  }) => {
    if (round % 3 === 0) {
      weapon.BONUS = 0;
      weapon.DAMAGE = 0;
    }
  },
  "Quad Shot: Must reload after every 4 shots": ({
    weapon,
    options,
    round,
  }) => {
    if (round % 4 === 0) {
      weapon.BONUS = 0;
      weapon.DAMAGE = 0;
    }
  },
  "Single shot": ({ weapon, options, round, results }) => {
    if (round % 2 === 0) {
      weapon.BONUS = 0;
      weapon.DAMAGE = 0;
    }
  },
  "Grenade Launcher": ({ weapon, options, round, results }) => {},
  "Damage: 3 Short": ({ weapon, options, round, results }) => {
    if (options.range <= 1) weapon.DAMAGE = 3;
  },
  "2 Medium or further": ({ weapon, options, round, results }) => {
    if (options.range >= 2) weapon.DAMAGE += 2;
  },
  "Blast 9 (Fires: Mark 6 High Explosive Smart Bounce": ({
    weapon,
    options,
    round,
  }) => {
    weapon.DAMAGE += rollDice(9).filter((s) => s == 6);
  },
  "Blast 9": ({ weapon, options, round, results }) => {
    weapon.DAMAGE += rollDice(9).filter((s) => s == 6);
  },
  "Fire Intensity 9": ({ weapon, options, round, results }) => {},
  "Full Auto": ({ weapon, options, round, results }) => {
    if(options['Use full auto']) weapon.BONUS +=2
  },
  "Fire Intensity 8": ({ weapon, options, round, results }) => {},
  "Power Supply 5": ({ weapon, options, round, results }) => {},
};

var defaultOptions = {
  rangedCombat: 1,
  agility: 3,
  armour: 5,
  stress: 1,
  aspects: [
    { default: false, value: "Total Damage", label: "Total Damage" },
    { default: true, value: "Damage", label: "Damage" },
    { default: true, value: "Bonus Damage", label: "Bonus Damage" },
    {
      default: true,
      value: "Armour Damage Reduction",
      label: "Armour Damage Reduction",
    },
  ],
};

const aspectData = {
  Damage: {
    plural: "DPR",
  },
  "Bonus Damage": {
    plural: "Pushed DPR",
  },
};

const runSingleTest = ({
  weapon,
  round,
  results,
  options = defaultOptions,
}) => {
  var thisWeapon = { ...weapon };
  var thisOptions = { ...options };

  // modify the weapon stats for this round based on the weapon talents
  for (var [talentName, talentFunction] of Object.entries(weaponTalentParser)) {
    if (weapon[talentName]) {
      var update = talentFunction({
        weapon: thisWeapon,
        options: thisOptions,
        round,
        results,
      });
      thisWeapon = { ...thisWeapon, ...update?.thisWeapon };
      thisOptions = { ...thisOptions, ...update?.thisOptions };
    }
  }

  // make attack
  var {
    rangedCombat,
    agility,
    // targetSize,
    // range,
    // numberOfEnemies,
    stress,
    armour,
  } = thisOptions;

  var { DAMAGE, BONUS, RANGE } = thisWeapon;

  var stressRoll = rollDice(stress);
  var stressFailures = stressRoll.filter((s) => s == 1);
  var stressSuccesses = stressRoll.filter((s) => s == 6);

  // console.log({stressRoll,stressFailures,
  // stressSuccesses})

  var rawRoll = rollDice(rangedCombat + agility + BONUS);
  var successes = [...rawRoll, ...stressRoll].filter((s) => s == 6);
  var failures = [...rawRoll, ...stressRoll].filter((s) => s == 1);

  var Damage = successes.length < 1 ? 0 : DAMAGE;
  var pushedDamage = successes.length > 1 ? successes.length - 1 : 0;

  var armourSaves = rollDice(armour).filter((s) => s == 6);

  var damageReduction = armourSaves.length > 1 ? armourSaves.length : 0;
  damageReduction = -damageReduction;

  if (
    options["Enable reloading"] &&
    results.at(-1)?.stressFailures?.length > 0
  ) {
    pushedDamage = 0;
    damageReduction = 0;
    Damage = 0;
    pushedDamage = 0;
    damageReduction = 0;
    rawRoll = [];
    successes = [];
    failures = [];
    stressFailures = [];
    stressSuccesses = [];
  }

  var result = {
    "Bonus Damage": pushedDamage,
    "Armour Damage Reduction": damageReduction,
    Damage,
    "Total Damage": Damage + pushedDamage + damageReduction,
    rawRoll,
    successes,
    failures,
    stressFailures,
    stressSuccesses,
  };
  return result;
};

/*
each test contains a number of rounds
each round contains a single attack test

the number of rounds dictates how much 'alpha strike' a weapon has, ie how front loaded its damage is

*/

// const runCombatRoundTest = ({rounds=20,weapon,options})=>{
//     // console.log('running', rounds, 'round tests on', weapon.NAME);
//   return Array.from({ length: rounds }).map((n, i) =>
//     runSingleTest({ weapon, options, round: i })
//   ).map(e=>{
//     console.log(e)
//     lmao()
//     return e
//   })
// }

const runManyTests = ({ num, weapon, options }) => {
  console.log("running", num, "iteration tests on", weapon.NAME);

  var results = [];
  Array.from({ length: num }).forEach((n, i) => {
    results.push(runSingleTest({ weapon, options, round: i, results }));
  });
  return results;
};

const runTestsOnWeapons = ({ weapons, num, options }) => {
  var o = [];
  console.log(options);

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
