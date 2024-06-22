import './App.scss';
import React, { useEffect, useState } from "react";
import CountryCarbonBar from './Components/CountryCarbonBar';

function App() {
  const [footprints, setFootprints] = useState({});
  const [currentYear, setCurrentYear] = useState(1960);
  const [globalTotal, setGlobalTotal] = useState(22701);
  const [currentYearFootPrints, setCurrentYearFootPrints] = useState([]);

  async function getFootPrints() {
    const response = await fetch("http://localhost:5000/footprints");
    const data = await response.json();
    setFootprints(data?.data);
    setGlobalTotal(data?.data?.worldTotalCarbon)
  }

  useEffect(() => {
    getFootPrints();
  }, []);

  useEffect(() => {
    if (!footprints || Object.keys(footprints).length === 0) return;

    const intervalId = setInterval(() => {
      const nextYear = currentYear + 1;
      if (footprints[nextYear]) {
        setCurrentYear(nextYear);
        setCurrentYearFootPrints(footprints[nextYear].entries);
      } else {
        setCurrentYear(1960);
      }
    }, 400);

    return () => clearInterval(intervalId);
  }, [footprints, currentYear]);

  return (
    <div className='app'>
      <div className='content'>
        <h1 className='main-heading'>Historic global carbon footprint</h1>
        <div className='dashboard'>
          <div className="year">
            <span className="label">Year</span>
            <span className="value">{currentYear}</span>
          </div>
          <div className="total">
            <span className="label">Global total</span>
            <span className="value">{globalTotal.toFixed(0)}</span>
          </div>
        </div>

        <div className="countries-report">
          <p className='total-label'>total</p>
          {
            currentYearFootPrints?.map((footprint, index) => {
              if (index <= 4) {
                return <CountryCarbonBar index={index + 1} {...footprint} />
              }
            })
          }
          <CountryCarbonBar />
          {currentYearFootPrints?.length > 0 && (
            <CountryCarbonBar index={10}  {...currentYearFootPrints[currentYearFootPrints.length - 1]} />
          )}
        </div>
      </div>
    </div >
  );
}

export default App;