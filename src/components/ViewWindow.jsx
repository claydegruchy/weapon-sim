import React from 'react';

import { runSingleTest, runManyTests, runTestsOnWeapons } from './WeaponUtils';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

var dynamicColors = function () {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

const ViewWindow = ({
  selectedWeapons,
  weaponFilter,
  aspects,
  iterations = 50,
  uiOptions,
  weapons,
}) => {
  const exampleWeapon = weapons[0];

  var activeWeapons = weapons.filter((w) =>
    selectedWeapons.map((v) => v.value).includes(w.NAME)
  );

  // var { agility, rangedCombat } = uiOptions;
  var outcome = runTestsOnWeapons({
    options: uiOptions,
    weapons: activeWeapons,
    num: iterations,
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Weapon Chart - ${iterations} iterations`,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = activeWeapons.map((e) => e.NAME); // ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // var aspects = ;

  const chartData = {
    labels,
    datasets: aspects.map((aspect) => ({
      label: `Average ${aspect} per round`,
      data: outcome.map((w) => w.aspectAverage(aspect)),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: dynamicColors(),
    })),
  };

  return (
    <div>
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
};

export default ViewWindow;
export { ViewWindow };
