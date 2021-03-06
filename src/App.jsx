import { useState, useEffect } from "react";
import logo from "./logo.svg";
import { ViewWindow } from "./components/ViewWindow";
import weapons from "./components/weapons.json";
import { DropDownStyles } from "./components/DropDownStyles";
import "./App.css";
import Select from "react-select";

import "./scanlines.css";

import { defaultOptions, aspectData } from "./components/WeaponUtils";

const themes = {
  default: {
    dark: "#030e04",
    background: "#152d1b",
    minorhighlights: "#8fbba4",
    light: "#00f562",
    highlight: "#B3D0C1",
  },
  teal: {
    dark: "#092122",
    background: "#204343",
    minorhighlights: "#356565",
    light: "#C2C2C2",
    highlight: "#356565",
  },
  grayscale: {
    dark: "#000000",
    background: "#474747",
    minorhighlights: "#8f8f8f",
    light: "#d6d6d6",
    highlight: "#8f8f8f",
  },
};

const windowUrl = window.location.search;
const params = Object.fromEntries(new URLSearchParams(windowUrl));

if (params.selectedTheme) {
  params.selectedTheme = {
    label: params.selectedTheme,
    value: params.selectedTheme,
  };
}

var aspectOptions = defaultOptions.aspects;

var weaponOptions = weapons.map((v) => ({
  label: `[${v.TYPE}] - ${v.NAME}`,
  value: v.NAME,
}));

var defaultUiParams = {
  selectedTheme: {
    value: "default",
    label: "default",
  },
  iterations: 5000,
  search: "",

  selectedWeapons: weaponOptions.filter((a, i) => i < 10),
  ...defaultOptions,

  aspects: defaultOptions.aspects.filter((a) => a.default),
  ...params,
};

function App() {
  const [uiOptions, setUiOptions] = useState(defaultUiParams);

  useEffect(() => {
    // Stuff to do when the UI updates

    // setting the themes
    var cssVarPrefix = "--main-";
    var t = uiOptions.selectedTheme;
    if (!t) t = defaultUiParams.selectedTheme;
    if (t && t.value) t = t.value;
    for (var [k, v] of Object.entries(themes[t])) {
      document.documentElement.style.setProperty(cssVarPrefix + k, v);
      var color2 = getComputedStyle(document.documentElement).getPropertyValue(
        cssVarPrefix + k
      );
    }
  }, [uiOptions]);

  useEffect(() => {
    uiOptions.search;
  }, [uiOptions.search]);

  // console.log({ weaponOptions });

  const SearchableDropdown = ({ label, options, selectParams, isMulti }) => {
    const set = (e) => setUiOptions({ ...uiOptions, [label]: e });
    return (
      <div>
        {/*this select package really fucking sucks ass, the style application
         system is garbo and akin to banging rocks together */}
        <Select
          isMulti={isMulti}
          closeMenuOnSelect={false}
          hideSelectedOptions={true}
          backspaceRemovesValue={true}
          blurInputOnSelect={false}
          // isClearable
          {...selectParams}
          // placeholder={''}
          value={uiOptions[label]}
          onChange={set}
          theme={themes[uiOptions.selectedTheme.value]}
          styles={DropDownStyles}
          options={options}
        />
      </div>
    );
  };

  const search = (e) => setUiOptions({ ...uiOptions, search: e.target.value });

  var select = (v) =>
    setUiOptions({
      ...uiOptions,
      selectedWeapons: [
        ...uiOptions.selectedWeapons,
        {
          label: `[${v.TYPE}] - ${v.NAME}`,
          value: v.NAME,
        },
      ],
    });

  var deselect = (v) =>
    setUiOptions({
      ...uiOptions,
      selectedWeapons: uiOptions.selectedWeapons.filter(
        (s) => s.value != v.NAME
      ),
    });

  const Weapon = ({ weapon, selected, i }) => {
    var s = !!selected.find((v) => v.value == weapon.NAME);

    return (
      <div
        onClick={(e) => (s ? deselect(weapon) : select(weapon))}
        className={[
          "link-hover control-box",
          i % 2 === 0 ? "even" : "odd",
          s ? "" : "select",
        ].join(" ")}
      >
        {weapon.NAME}
        <div
          className={["control-box thin-box", s ? "" : "select"].join(" ")}
          style={{ display: "flex" }}
        >
          <div>RANGE: {weapon.RANGE}</div>
          <div>BONUS: {weapon.BONUS}</div>
          <div>DAMAGE: {weapon.DAMAGE}</div>
          <div>WEIGHT: {weapon.WEIGHT}</div>
        </div>
        <div>COMMENT: {weapon.COMMENT}</div>
      </div>
    );
  };

  const WeaponPicker = ({ weapons, selected }) => {
    var groups = [...new Set(weapons.map((w) => w.TYPE))];

    return (
      <div style={{ flex: 4, overflowY: "auto" }}>
        {groups
          .map((type) => weapons.filter((w) => w.TYPE == type))
          .map((weapons) => {
            var groupname = weapons[0].TYPE;
            var anySelected = weapons.filter((w) =>
              selected.map((v) => v.value).includes(w.NAME)
            );

            return (
              <div className={"control-box thin-box"}>
                <div
                  onClick={(e) =>
                    anySelected.length > 0
                      ? setUiOptions({
                          ...uiOptions,
                          selectedWeapons: uiOptions.selectedWeapons.filter(
                            (v) =>
                              !anySelected.map((w) => w.NAME).includes(v.value)
                          ),
                        })
                      : setUiOptions({
                          ...uiOptions,
                          selectedWeapons: [
                            ...uiOptions.selectedWeapons,
                            ...weapons
                              .filter((w) => w.TYPE == groupname)
                              .map((v) => ({
                                label: `[${v.TYPE}] - ${v.NAME}`,
                                value: v.NAME,
                              })),
                          ],
                        })
                  }
                >
                  {weapons[0].TYPE} (
                  {anySelected.length > 0 ? "Remove All" : "Add All"})
                </div>
                {weapons.map((weapon, i) => (
                  <Weapon weapon={weapon} selected={selected} i={i} />
                ))}
              </div>
            );
          })}
      </div>
    );
  };

  const Checkbox = ({ label, def, secretMessage }) => {
    if (uiOptions[label] === undefined && def)
      setUiOptions({ ...uiOptions, [label]: def });
    const set = (e) =>
      setUiOptions({ ...uiOptions, [label]: !uiOptions[label] });
    return (
      <div
        className={"horizontal"}
        style={{ padding: 5 }}
        title={secretMessage}
      >
        <input
          className={"form-control"}
          name={label}
          type="checkbox"
          checked={uiOptions[label]}
          onChange={set}
        />
        <div style={{ paddingLeft: 10 }}>{label}</div>
      </div>
    );
  };

  return (
    <div
      className="App crt"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        className={"control-panel"}
        style={{ width: "25vw", height: "95vh", overflowY: "auto" }}
      >
        <div className={"control-box "}>
          <h3 className={"center"}>TACTICAL SIMULATION SYSTEM v0.1</h3>
          <div>
            <a
              href={"https://github.com/claydegruchy/"}
              className={"center"}
              style={{
                padding: 5,
              }}
            >
              Created by Clay D
            </a>
          </div>
        </div>
        <div className={"control-box"}>
          Selected Stats
          <SearchableDropdown
            label={"aspects"}
            options={aspectOptions}
            isMulti={true}
          />
        </div>
        <div className={"control-box horizontal label-input"}>
          <label htmlFor={"iterations"}>Iterations</label>

          <input
            name={"iterations"}
            type={"number"}
            onChange={(e) =>
              setUiOptions({
                ...uiOptions,
                iterations: parseInt(e.target.value),
              })
            }
            value={uiOptions.iterations}
            placeholder={"Iterations"}
          />
        </div>
        <div className={"control-box"}>
          Attacker
          <div className={"control-box horizontal label-input"}>
            <label htmlFor={"agility"}>Agility</label>

            <input
              name={"agility"}
              type={"number"}
              onChange={(e) =>
                setUiOptions({
                  ...uiOptions,
                  agility: parseInt(e.target.value),
                })
              }
              value={uiOptions.agility}
              placeholder={"Agility"}
            />
          </div>
          <div className={"control-box horizontal label-input"}>
            <label htmlFor={"rangedCombat"}>Ranged Combat</label>

            <input
              name={"rangedCombat"}
              type={"number"}
              onChange={(e) =>
                setUiOptions({
                  ...uiOptions,
                  rangedCombat: parseInt(e.target.value),
                })
              }
              value={uiOptions.rangedCombat}
              placeholder={"Ranged combat"}
            />
          </div>
          <div className={"control-box horizontal label-input"}>
            <label htmlFor={"stress"}>Stress</label>

            <input
              name={"stress"}
              type={"number"}
              onChange={(e) =>
                setUiOptions({
                  ...uiOptions,
                  stress: parseInt(e.target.value),
                })
              }
              value={uiOptions.stress}
              placeholder={"Stress"}
            />
          </div>
          {uiOptions.stress > 0 ? (
            <Checkbox label={"Enable reloading"} />
          ) : null}
          <Checkbox label={"Use full auto"} />
        </div>

        <div className={"control-box"}>
          Defender
          <div className={"control-box horizontal label-input"}>
            <label htmlFor={"armour"}>Armour</label>

            <input
              name={"armour"}
              type={"number"}
              onChange={(e) =>
                setUiOptions({
                  ...uiOptions,
                  armour: parseInt(e.target.value),
                })
              }
              value={uiOptions.armour}
              placeholder={"Iterations"}
            />
          </div>
        </div>
        <div className={"control-box"}>
          <div className={" horizontal label-input"}>
            <input
              style={{ flex: 2 }}
              name={"search"}
              key={"x"}
              onChange={search}
              value={uiOptions.search}
              placeholder={"Filter weapons"}
            />
            {uiOptions.search != "" ? (
              <div
                onClick={(e) => setUiOptions({ ...uiOptions, search: "" })}
                className={"control-box center link-hover"}
              >
                [CLEAR]
              </div>
            ) : null}
          </div>
          <div
            onClick={(e) =>
              uiOptions.selectedWeapons.length < 1
                ? setUiOptions({
                    ...uiOptions,
                    selectedWeapons: weaponOptions,
                  })
                : setUiOptions({
                    ...uiOptions,
                    selectedWeapons: [],
                  })
            }
          >
            Selected Weapons (
            {uiOptions.selectedWeapons.length < 1 ? "Add All" : "Remove All"})
          </div>

          {/* <SearchableDropdown
            label={'selectedWeapons'}
            options={weaponOptions}
            isMulti={true}
          />*/}

          <WeaponPicker
            weapons={weapons.filter((w) =>
              w.NAME.toLowerCase().includes(uiOptions.search.toLowerCase())
            )}
            selected={uiOptions.selectedWeapons}
          />
        </div>
      </div>

      <div className={"map-box"}>
        <ViewWindow
          selectedWeapons={uiOptions.selectedWeapons}
          weaponFilter={(w) => w.TYPE == "PISTOLS"}
          aspects={uiOptions.aspects.map((s) => s.value)}
          iterations={uiOptions.iterations}
          uiOptions={uiOptions}
          weapons={weapons}
        />
      </div>
    </div>
  );
}

export default App;
